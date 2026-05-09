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
    check_permission(request)
    group_users = get_group_mail_users()
    return Response(group_users)

@api_view(['POST'])
def add_user_to_group(request):
    check_permission(request)

    user = request.data['user']
    check_name(user)
    if not user_exists(user):
        raise PermissionDenied({'error': 'User does not exist.'})
    
    group = request.data['group']
    check_name(group)
    if group in DEFAULT_GROUPS:
        raise PermissionDenied({'error': 'Cannot change default groups'})
    
    add_user_to_mail_group(user, group)
    return Response({'ok': True})

@api_view(['POST'])
def remove_user_from_group(request):
    check_permission(request)

    user = request.data['user']
    check_name(user)
    
    group = request.data['group']
    check_name(group)
    if group in DEFAULT_GROUPS:
        raise PermissionDenied({'error': 'Cannot change default groups'})
    
    remove_user_from_mail_group(user, group)
    return Response({'ok': True})

@api_view(['POST'])
def remove_group(request):
    check_permission(request)
    
    group = request.data['group']
    check_name(group)
    if group in DEFAULT_GROUPS:
        raise PermissionDenied({'error': 'Cannot remove default groups'})
    
    remove_mail_group(group)
    return Response({'ok': True})
