import datetime
import os
import socketio

from urllib.parse import parse_qs
from django.core.wsgi import get_wsgi_application
from django.conf import settings
from rest_framework.authtoken.models import Token

from app.models import Device, Broadcast, Poll, Vote, Timer

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'broadcast.settings')

mgr = socketio.KombuManager(settings.CELERY_BROKER_URL)
sio = socketio.Server(logger=True, cors_allowed_origins='*', client_manager=mgr, engineio_logger=True)
application = socketio.WSGIApp(sio, get_wsgi_application())

Device.objects.all().delete()


@sio.event
def connect(sid, environ):
    print(f'connected: {sid=}')
    query = parse_qs(environ['QUERY_STRING'])
    token = query.get('token')[0]
    if token == 'celery':
        print('CELERY CONNECTED')
        return
    token_object = Token.objects.filter(key=token).select_related('user').first()
    if not token_object:
        # sio.send(dict(payload=dict(), type='token_expired'), sid=sid)
        return
    user = token_object.user
    region = 'sibir' if 'sibir' in user.partner.split('/') else 'center'
    sio.enter_room(sid, region)
    sio.enter_room(sid, token)
    device_type = query.get('type')[0]
    Device.objects.create(type=device_type, user=user, sid=sid)
    if broadcast := Broadcast.objects.filter(region=region).last():
        sio.send(dict(payload=dict(link=broadcast.link,), type='broadcast_start'), room=token)
    else:
        sio.send(dict(payload=dict(), type='broadcast_end'), room=token)
    if poll := Poll.objects.filter(start=True, ended=False, region=region).first():
        selected = None
        if vote := Vote.objects.filter(user=user, poll=poll).first():
            selected = 1 if vote.first_answer_win else 2

        timer_seconds = 0
        if Timer.objects.filter(poll=poll):
            now = datetime.datetime.now(datetime.timezone.utc)
            if now < poll.timer.datetime_end:
                timer_seconds = (poll.timer.datetime_end - now).seconds
        else:
            timer_seconds = poll.timer_seconds
        sio.send(
            dict(
                payload=dict(
                    question=poll.question,
                    first_answer=poll.first_answer,
                    second_answer=poll.second_answer,
                    timer_seconds=timer_seconds,
                    id=poll.id,
                    selected=selected,
                ),
                type='poll_start',
            ),
            room=token
        )


@sio.event
def disconnect(sid):
    print(f'disconnected: {sid=}')
    device = Device.objects.filter(sid=sid).select_related('user').first()
    if not device:
        print(f'device not founded for {sid=}')
        return
    user = device.user
    if not hasattr(user, 'auth_token'):
        user.devices.all().delete()
    else:
        device.delete()


@sio.event
def poll_results(sid, data):
    room = data.pop('room')
    sio.send(data, room=room)


@sio.event
def poll_end(sid, data):
    room = data.pop('room')
    sio.send(data, room=room)


@sio.event
def message(sid, data):
    if data['type'] == 'vote':
        device = Device.objects.filter(sid=sid).select_related('user').first()
        if not device:
            return
        user = device.user
        if not hasattr(user, 'auth_token'):
            user.devices.all().delete()
            return
        data = data['payload']
        poll = Poll.objects.filter(id=data['id']).first()
        if not poll:
            return
        selected = data['answer']
        vote, created = Vote.objects.get_or_create(user_id=user.id, poll_id=poll.id)
        if created and (selected == 2):
            vote.first_answer_win = False
            vote.save()
        sio.send(
            dict(
                payload=dict(
                    id=poll.id,
                    selected=selected,
                ),
                type='poll_answered',
            ),
            room=str(user.auth_token)
        )
