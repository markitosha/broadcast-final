"""
ASGI config for broadcast project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

# from broadcast.websocket import websocket_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'broadcast.settings')

django_application = get_asgi_application()
#
#
# async def application(scope, receive, send):
#     # await websocket_application(scope, receive, send)
#     # print(f'{scope=}')
#     # print(f'{receive=}')
#     # print(f'{send=}')
#     if scope['type'] == 'http':
#         if scope['path'] == '/socket.io/':
#             await websocket_application(scope, receive, send)
#         else:
#             await django_application(scope, receive, send)
#     elif scope['type'] == 'websocket':
#         await websocket_application(scope, receive, send)
#     else:
#         raise NotImplementedError(f"Unknown scope type {scope['type']}")
