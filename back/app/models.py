from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MaxValueValidator, MinValueValidator

from phonenumber_field.modelfields import PhoneNumberField


# class TimeZone(models.IntegerChoices):
#     FIRST = 1
#     SECOND = 2

from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

from phonenumber_field.phonenumber import to_python


def own_validate_international_phonenumber(value):
    phone_number = to_python(value)
    if phone_number and not phone_number.is_valid():
        raise ValidationError(
            _("Введен некорректный номер телефона."), code="invalid_phone_number"
        )


class OwnPhoneNumberField(PhoneNumberField):
    default_validators = [own_validate_international_phonenumber]


class User(AbstractUser):
    phone = OwnPhoneNumberField(
        verbose_name='phone',
        unique=True,
        error_messages={'unique': 'Пользователь с таким номером телефона уже существует.'},
    )
    USERNAME_FIELD = 'phone'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'email', 'city', 'partner']

    first_name = models.CharField('first name', max_length=150)
    last_name = models.CharField('last name', max_length=150)
    middle_name = models.CharField('middle name', max_length=150, blank=True)
    email = models.EmailField('email address')
    city = models.CharField('city', max_length=255)
    partner = models.CharField('partner', max_length=255)

    # time_zone = models.CharField(choices=TimeZone.choices, default=TimeZone.FIRST)

    username = models.CharField(
        'username', max_length=255, null=True, blank=True, default=None
    )

    def __str__(self):
        return self.phone.as_e164


class Device(models.Model):
    type = models.CharField('type', max_length=128)
    sid = models.CharField('sid', max_length=128, default='qwe')
    user = models.ForeignKey(User, related_name='devices', on_delete=models.CASCADE)


class Broadcast(models.Model):
    link = models.URLField('link')
    region = models.CharField(max_length=16, choices=[('sibir', 'Сибирь'), ('center', 'Центр')], default='center')

    def __str__(self):
        return self.link


class Poll(models.Model):
    question = models.CharField('question', max_length=255)
    first_answer = models.CharField('first_answer', max_length=255)
    second_answer = models.CharField('second_answer', max_length=255)
    first_answer_percentage = models.PositiveSmallIntegerField(
        default=0, validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    timer_seconds = models.SmallIntegerField(blank=True, default=120)
    users = models.ManyToManyField(User, through='app.Vote', related_name='polls')
    start = models.BooleanField(default=False)
    ended = models.BooleanField(default=False)
    region = models.CharField(max_length=16, choices=[('sibir', 'Сибирь'), ('center', 'Центр')], default='center')

    def __str__(self):
        return self.question


class Vote(models.Model):
    poll = models.ForeignKey(Poll, related_name='votes', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='votes', on_delete=models.SET_NULL, null=True)
    first_answer_win = models.BooleanField(default=True)


class Timer(models.Model):
    poll = models.OneToOneField(Poll, on_delete=models.CASCADE)
    datetime_end = models.DateTimeField()
