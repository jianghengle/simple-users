import os
import uuid
import re
from datetime import datetime, timezone, timedelta
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.exceptions import PermissionDenied
from . import *

@api_view(['POST'])
def get_org_groups(request):
    check_user_permission(request)
    group_users = get_group_mail_users()
    return Response(group_users)


@api_view(['POST'])
def add_user_to_group(request):
    check_admin_permission(request)

    action_username = request.data['actionUsername']
    check_name(action_username)
    if not user_exists(action_username):
        raise PermissionDenied({'error': 'User does not exist.'})
    action_user_groups = get_user_groups(action_username)
    if 'org-user' not in action_user_groups:
        raise PermissionDenied({'error': 'Wrong user'})
    
    group = request.data['group']
    check_name(group)
    if group in DEFAULT_GROUPS:
        raise PermissionDenied({'error': 'Cannot change default groups'})
    
    add_user_to_mail_group(action_username, group)
    return Response({'ok': True})


@api_view(['POST'])
def remove_user_from_group(request):
    check_admin_permission(request)

    action_username = request.data['actionUsername']
    check_name(action_username)
    if not user_exists(action_username):
        raise PermissionDenied({'error': 'User does not exist.'})
    action_user_groups = get_user_groups(action_username)
    if 'org-user' not in action_user_groups:
        raise PermissionDenied({'error': 'Wrong user'})
    
    group = request.data['group']
    check_name(group)
    if group in DEFAULT_GROUPS:
        raise PermissionDenied({'error': 'Cannot change default groups'})
    
    remove_user_from_mail_group(action_username, group)
    return Response({'ok': True})


@api_view(['POST'])
def remove_group(request):
    check_admin_permission(request)
    
    group = request.data['group']
    check_name(group)
    if group in DEFAULT_GROUPS:
        raise PermissionDenied({'error': 'Cannot remove default groups'})
    
    remove_mail_group(group)
    return Response({'ok': True})
