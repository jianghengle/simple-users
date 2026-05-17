import os
import uuid
import re
import secrets
from datetime import datetime, timezone, timedelta
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.exceptions import PermissionDenied
from . import *


@api_view(['POST'])
def login_user(request):
    username = request.data['username']
    check_name(username)
    if not user_exists(username):
        raise PermissionDenied({'error': 'User does not exist.'})

    password = request.data['password']
    if re.search(r"\s", password) or '"' in password:
        raise PermissionDenied({'error': 'Password contains invalid character'})
    
    cmd = 'echo "' + password + '" | su -c "whoami" ' + username
    try:
        run_cmd(cmd)
    except Exception as e:
        print(e)
        raise PermissionDenied({'error': 'Invalid username or password'})
    token = secrets.token_urlsafe(64)
    session_file = '/home/.org/' + username + '_session'
    with open(session_file, 'w') as file:
        file.write(token)
    groups = get_user_groups(username)
    if 'org-user' not in groups:
        raise PermissionDenied({'error': 'Access Denied. Not in user group.'})
    role = 'user'
    if 'org-admin' in groups:
        role = 'admin'
    if 'org-owner' in groups:
        role = 'owner'
    return Response({'username': username, 'token': token, 'role': role})


@api_view(['POST'])
def get_org_users(request):
    check_user_permission(request)

    users = get_group_users('org-user')
    admins = get_group_users('org-admin')
    owners = get_group_users('org-owner')
    users_status = get_users_status(users)

    result = []
    for u in users:
        user = {'username': u, 'role': 'user', 'status': 'unknown'}
        if u in owners:
            user['role'] = 'owner'
        elif u in admins:
            user['role'] = 'admin'
        if u in users_status:
            user['status'] = users_status[u]
        result.append(user)
    return Response(result)


@api_view(['POST'])
def add_new_user(request):
    check_admin_permission(request)
    username = request.data['username']
    new_username = request.data['newUsername']
    check_name(new_username)
    if user_exists(new_username):
        raise PermissionDenied({'error': 'User exists.'})

    sudo_cmd = 'sudo adduser --disabled-password --gecos "" ' + new_username
    run_cmd(sudo_cmd)
    log_sudo(sudo_cmd, username)
    sudo_cmd = 'sudo usermod -aG org-user ' + new_username
    run_cmd(sudo_cmd)
    log_sudo(sudo_cmd, username)
    add_user_to_mail_group(username, 'all')
    return Response({'ok': True})


@api_view(['POST'])
def change_password(request):
    username = request.data['username']
    groups = check_user_permission(request)
    action_username = request.data['actionUsername']
    if action_username != username:
        check_name(action_username)
        if not user_exists(action_username):
            raise PermissionDenied({'error': 'Action user does not exist.'})
        if 'org-owner' not in groups and 'org-admin' not in groups:
            raise PermissionDenied({'error': 'Access Denied. Need org-owner or org-admin permission.'})

    new_password = request.data['newPassword']
    if re.search(r"\s", new_password):
        raise PermissionDenied({'error': 'New password contains whitespace.'})

    sudo_cmd = 'echo ' + "'" + action_username + ':' + new_password + "'" + ' | sudo chpasswd'
    run_cmd(sudo_cmd)
    log_sudo(sudo_cmd, username)

    return Response({'ok': True})


@api_view(['POST'])
def change_role(request):
    check_admin_permission(request)
    username = request.data['username']

    action_username = request.data['actionUsername']
    if username == action_username:
        raise PermissionDenied({'error': 'Cannot action on self'})
    check_name(action_username)
    if not user_exists(action_username):
        raise PermissionDenied({'error': 'Action user does not exist.'})

    action_user_groups = get_user_groups(action_username)
    if 'org-owner' in action_user_groups:
        raise PermissionDenied({'error': 'Cannot action on owner'})

    new_role = request.data['newRole']
    if new_role not in ['admin', 'user']:
        raise PermissionDenied({'error': 'Invalid role'})

    if 'org-admin' in action_user_groups and new_role == 'user':
        sudo_cmd = 'sudo deluser ' + action_username + ' org-admin'
        run_cmd(sudo_cmd)
        log_sudo(sudo_cmd, username)

    if 'org-admin' not in action_user_groups and new_role == 'admin':
        sudo_cmd = 'sudo usermod -aG org-admin ' + action_username
        run_cmd(sudo_cmd)
        log_sudo(sudo_cmd, username)

    return Response({'ok': True})


@api_view(['POST'])
def lock_user(request):
    check_admin_permission(request)
    username = request.data['username']
    action_username = request.data['actionUsername']
    if username == action_username:
        raise PermissionDenied({'error': 'Cannot action on yourself'})

    if not user_exists(action_username):
        raise PermissionDenied({'error': 'Action user not exists.'})
    action_user_groups = get_user_groups(action_username)
    if 'org-owner' in action_user_groups or 'org-admin' in action_user_groups:
        raise PermissionDenied({'error': 'Action cannot apply to org-owner or org-admin.'})

    sudo_cmd = 'sudo passwd -l ' + action_username
    run_cmd(sudo_cmd)
    log_sudo(sudo_cmd, username)
    return Response({'ok': True})


@api_view(['POST'])
def unlock_user(request):
    check_admin_permission(request)
    username = request.data['username']
    action_username = request.data['actionUsername']
    if username == action_username:
        raise PermissionDenied({'error': 'Cannot action on yourself'})

    if not user_exists(action_username):
        raise PermissionDenied({'error': 'Action user not exists.'})

    sudo_cmd = 'sudo passwd -u ' + action_username
    run_cmd(sudo_cmd)
    log_sudo(sudo_cmd, username)
    return Response({'ok': True})
