import os

from django.conf import settings
from django.http import HttpResponse
from django.contrib.auth.signals import user_logged_out, user_logged_in
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics, permissions

from app.models import User, Broadcast
from app.serializers import AuthSerializer, UserSerializer


class LogoutApi(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)

    def delete(self, request: Request):
        user = request.user
        user.auth_token.delete()
        user_logged_out.send(sender=user.__class__, request=request, user=user)
        return Response(status=200)


class LoginApi(APIView):
    authentication_classes = (TokenAuthentication,)

    def post(self, request: Request):
        data = request.data
        ser = AuthSerializer(data=data)
        ser.is_valid(raise_exception=True)
        user = ser.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        user_logged_in.send(sender=user.__class__, request=request, user=user)
        resp = AuthSerializer(user).data
        resp['token'] = token.key
        resp['partner'] = user.partner
        region = 'sibir' if 'sibir' in user.partner.split('/') else 'center'
        if broadcast := Broadcast.objects.filter(region=region).last():
            resp['broadcast_link'] = broadcast.link
        return Response(resp)


class SignUpApi(generics.CreateAPIView):

    serializer_class = UserSerializer
    model = User
    queryset = User.objects.all()

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        user_logged_in.send(sender=user.__class__, request=request, user=user)
        resp = AuthSerializer(user).data
        resp['token'] = token.key
        region = 'sibir' if 'sibir' in user.partner.split('/') else 'center'
        if broadcast := Broadcast.objects.filter(region=region).last():
            resp['broadcast_link'] = broadcast.link
        return Response(resp)


async def index(request):
    """Serve the client-side application."""
    with open(os.path.join(settings.BASE_DIR, 'app/static/index.html')) as f:
        return HttpResponse(f.read())
