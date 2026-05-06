import os
import uuid
import re
from datetime import datetime, timezone, timedelta
from rest_framework.response import Response
from rest_framework.decorators import api_view
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
    operator = request.data['operator']
    username = request.data['username']
    check_name(username)
    if user_exists(username):
        raise PermissionDenied({'error': 'User exists.'})

    sudo_cmd = ['sudo', 'adduser', '--disabled-password', '--gecos', '""', username]
    run_cmd(sudo_cmd)
    log_sudo(sudo_cmd, operator)
    sudo_cmd = ['sudo', 'usermod', '-aG', 'org-user', username]
    run_cmd(sudo_cmd)
    log_sudo(sudo_cmd, operator)
    return Response({'ok': True})

@api_view(['POST'])
def get_reset_password_key(request):
    check_permission(request)
    username = request.data['username']
    check_name(username)
    if not user_exists(username):
        raise PermissionDenied({'error': 'User does not exist.'})

    key = str(uuid.uuid4())
    key_file = '/home/.org/' + username + '_reset_key'
    with open(key_file, 'w') as file:
        file.write(key)

    return Response({'key': key})

@api_view(['POST'])
def change_password(request):
    username = request.data['username']
    check_name(username)
    if not user_exists(username):
        raise PermissionDenied({'error': 'User does not exist.'})

    key = request.data['key']
    key_file = '/home/.org/' + username + '_reset_key'
    if not os.path.exists(key_file):
        raise PermissionDenied({'error': 'Invalid key.'})
    timestamp = os.path.getmtime(key_file)
    modified_date = datetime.fromtimestamp(timestamp)
    now = datetime.now()
    if now > modified_date + timedelta(days=3):
        raise PermissionDenied({'error': 'Key expired.'})
    with open(key_file, 'r') as file:
        content = file.read()
        if content != key:
            raise PermissionDenied({'error': 'Invalid key.'})

    password = request.data['password']
    if re.search(r"\s", password):
        raise PermissionDenied({'error': 'Password contains whitespace.'})

    sudo_cmd = ['echo', username + ':' + password, '|', 'sudo', 'chpasswd']
    run_cmd(sudo_cmd)
    log_sudo(sudo_cmd, username)

    os.remove(key_file)
    return Response({'ok': True})
