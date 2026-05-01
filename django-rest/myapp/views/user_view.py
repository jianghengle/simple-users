import os
import uuid
from datetime import datetime, timezone
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from . import run_cmd, check_permission, check_name, user_exists, log_sudo


@api_view(['POST'])
def get_org_users(request):
    check_permission(request)

    result = run_cmd(['getent', 'group', 'org-user'])
    ss = result.strip().split(':')
    names = ss[len(ss) - 1].split(',')
    users = []
    for name in names:
        if name.strip():
            users.append(name.strip())
    return Response(users)

@api_view(['POST'])
def add_new_user(request):
    check_permission(request)
    username = request.data['username']
    check_name(username)
    if user_exists(username):
        raise PermissionDenied({'error': 'User exists.'})
    sudo_cmd = ['sudo', 'useradd', '-s', '/sbin/nologin', username]
    run_cmd(sudo_cmd)
    log_sudo(sudo_cmd, username)
    return Response({'ok': True})
