from django.contrib.auth import authenticate
from django.core import exceptions
from rest_framework import serializers

from app.models import User


class AuthSerializer(serializers.Serializer):
    phone = serializers.CharField()

    def validate(self, data):
        phone = data.get('phone', '')
        if not phone:
            msg = {'phone': 'Необходимо ввести номер телефона'}
            raise exceptions.ValidationError(msg)

        users = User.objects.filter(phone=phone)
        if not users.exists():
            msg = {'phone': 'Пользователь с таким номером телефона не существует.'}
            raise exceptions.ValidationError(msg)

        user = authenticate(phone=phone, password='password')
        if not user:
            msg = 'Unable to login with given credentials.'
            raise exceptions.ValidationError(msg)
        if not user.is_active:
            msg = 'User is deactivated.'
            raise exceptions.ValidationError(msg)

        data['user'] = user
        return data


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'phone',
            'first_name',
            'last_name',
            'middle_name',
            'email',
            'city',
            'partner',
        )
