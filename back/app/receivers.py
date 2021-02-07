from django.db.models.signals import post_save, post_delete, pre_delete
from django.dispatch import receiver

from app.models import Broadcast, Poll, User
from app.tasks import poll_results_task, send_welcome_email
from broadcast.websocket import sio


@receiver(post_save, sender=Broadcast)
def broadcast_start(sender, instance, created, **__):
    sio.send(dict(payload=dict(link=instance.link,), type='broadcast_start'), room=instance.region)


@receiver(post_delete, sender=Broadcast)
def broadcast_end(sender, instance, **__):
    if not sender.objects.filter(region=instance.region).exists():
        sio.send(dict(payload=dict(), type='broadcast_end'), room=instance.region)


def _poll_start(poll):
    if poll.start and not poll.ended:
        sio.send(
            dict(
                payload=dict(
                    question=poll.question,
                    first_answer=poll.first_answer,
                    second_answer=poll.second_answer,
                    timer_seconds=poll.timer_seconds,
                    id=poll.id,
                    selected=None,
                ),
                type='poll_start',
            ),
            room=poll.region,
        )
        poll_results_task.delay(poll.id)


# for poll in Poll.objects.filter(start=True, ended=False):
#     print(f'start {poll=}')
#     _poll_start(poll)


@receiver(post_save, sender=Poll)
def poll_start_receiver(sender, instance, created, **__):
    _poll_start(instance)


@receiver(pre_delete, sender=Poll)
def poll_end_receiver(sender, instance, **__):

    sio.send(
        dict(
            payload=dict(
                winner=1 if instance.first_answer_percentage > 50 else 2,
                id=instance.id,
                first_answer_percent=instance.first_answer_percentage,
                second_answer_percent=100 - instance.first_answer_percentage,
            ),
            type='poll_end',
        ),
        room=instance.region,
    )


@receiver(post_save, sender=User)
def password_set(sender, instance, created, **__):
    if created:
        instance.set_password('password')
        instance.save()
        send_welcome_email(instance.id)
