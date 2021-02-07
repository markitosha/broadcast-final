import datetime
import random

import socketio
from django.conf import settings

from broadcast import celery_app

sio_client = socketio.Client(logger=True)

POLL_TIMER_DELAY = 5


@celery_app.task
def poll_results_task(poll_id):
    from app.models import Poll, Timer
    url = f'{settings.SOCKET_PROXY_URL.geturl()}?token=celery'
    print(url)
    try:
        sio_client.connect(url)
    except ValueError as e:
        if str(e) != 'Client is not in a disconnected state':
            raise e
    poll = Poll.objects.get(id=poll_id)
    if not (timer := Timer.objects.filter(poll=poll).first()):
        timer = Timer.objects.create(poll=poll,
                                     datetime_end=datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(
                                         seconds=poll.timer_seconds)
                                     )
    print(f'{timer.datetime_end=}')
    deviation = min(5, 100 - poll.first_answer_percentage, poll.first_answer_percentage)
    while timer and (datetime.datetime.now(datetime.timezone.utc) < timer.datetime_end):
        first_answer_percentage = poll.first_answer_percentage + random.randint(-deviation, deviation)
        print(f'waiting {POLL_TIMER_DELAY} seconds')
        sio_client.sleep(POLL_TIMER_DELAY)
        sio_client.emit(
            'poll_results',
            dict(
                payload=dict(
                    question=poll.question,
                    first_answer=poll.first_answer,
                    first_answer_percent=first_answer_percentage,
                    second_answer=poll.second_answer,
                    second_answer_percent=100 - first_answer_percentage,
                    id=poll.id,
                ),
                type='poll_results',
                room=poll.region,
            ),
        )
        timer = Timer.objects.filter(poll=poll).first()
    sio_client.emit(
        'poll_end',
        dict(
            payload=dict(
                winner=1 if poll.first_answer_percentage > 50 else 2,
                id=poll.id,
                first_answer_percent=poll.first_answer_percentage,
                second_answer_percent=100 - poll.first_answer_percentage,
            ),
            type='poll_end',
            room=poll.region
        ),
    )
    Poll.objects.filter(id=poll.id).update(ended=True)
    sio_client.sleep(3)
    sio_client.disconnect()


@celery_app.task
def send_welcome_email(user_id):
    from app.utils import email_manager
    from app.models import User
    user = User.objects.get(id=user_id)
    email_manager.send_with_template(
        To=[f'{user.first_name} {user.last_name} {user.email}'],
        From=settings.DEFAULT_FROM_EMAIL,
        TemplateId=None,
        TemplateAlias=f'success{"-ultima" if "ultima" in user.partner.split("/") else ""}',
        TemplateModel={
            'time': '16' if 'sibir' in user.partner.split('/') else '19',
            'partner': user.partner,
        },
    )


@celery_app.task
def send_invite_email(batch_size=50):
    from app.utils import email_manager
    from app.models import User
    user_ids_list = User.objects.filter(partner__contains='sibir').order_by('id').values_list('id', flat=True)

    offset = 0
    while offset < len(user_ids_list):
        ids = user_ids_list[offset: offset + batch_size]
        offset += batch_size
        emails = [
            email_manager.EmailTemplate(
                To=[f'{user.email}'],
                From=settings.DEFAULT_FROM_EMAIL,
                TemplateId=None,
                TemplateAlias=f'reminder{"-ultima" if "ultima" in user.partner.split("/") else ""}',
                TemplateModel={
                    'time': '16' if 'sibir' in user.partner.split('/') else '19',
                    'partner': user.partner,
                },
            )
            for user in User.objects.filter(id__in=ids)]
        email_manager.send_batch(*emails)
        print(f'email {ids[0]} - {ids[-1]}')


@celery_app.task
def send_invite_sms_sibir(batch_size=10):
    from app.utils import sms_manager
    from app.models import User
    user_ids_list = User.objects.filter(partner__contains='sibir').order_by('id').values_list('id', flat=True)

    offset = 0
    while offset < len(user_ids_list):
        ids = user_ids_list[offset: offset + batch_size]
        offset += batch_size
        print(';'.join(User.objects.filter(id__in=ids).values_list('phone', flat=True)))
        sms_manager.send(
            msg=f'Напоминаем, что прямая трансляция «Щелкунчик Reboot» начнется 15 минут',
            phones=';'.join(User.objects.filter(id__in=ids).values_list('phone', flat=True)),
            time='07.02.21 13:45', tz='0')
        print(f'sibir sms {ids[0]} - {ids[-1]}')


@celery_app.task
def send_invite_sms(batch_size=10):
    from app.utils import sms_manager
    from app.models import User
    user_ids_list = User.objects.exclude(partner__contains='sibir').order_by('id').values_list('id', flat=True)

    offset = 0
    while offset < len(user_ids_list):
        ids = user_ids_list[offset: offset + batch_size]
        offset += batch_size
        sms_manager.send(msg='test', phones=';'.join(User.objects.filter(id__in=ids).values_list('phone', flat=True)),
                         time='07.02.21 18:30', tz='0')
        print(f'sms {ids[0]} - {ids[-1]}')
