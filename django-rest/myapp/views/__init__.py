from rest_framework.exceptions import PermissionDenied
import random, string, re
import os, subprocess
from datetime import datetime


def get_random_string(n):
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=n))

def run_cmd(cmd):
    result = subprocess.run(cmd, capture_output=True, text=True, check=True)
    return result.stdout

def get_user_groups(username):
    result = run_cmd(['groups', username])
    ss = result.strip().split(':')
    names = ss[len(ss) - 1].strip().split(' ')
    groups = []
    for name in names:
        if name.strip():
            groups.append(name.strip())
    return groups

def file_exists(path):
    try:
        run_cmd(['ls', path])
        return True
    except:
        return False

def check_key(key):
    key_path = '/home/.org/org_key'
    if not file_exists(key_path):
        raise PermissionDenied({'error': 'Access Denied. No key.'})
    if run_cmd(['cat', key_path]).strip() != key:
        raise PermissionDenied({'error': 'Access Denied. Invalid key.'})

def check_name(name):
    pattern = r'^[a-z][-a-z0-9_]*$'
    match = re.fullmatch(pattern, name)
    if not match:
        raise PermissionDenied({'error': 'Invalid username.'})

def user_exists(username):
    try:
        run_cmd(['id', username])
        return True
    except:
        return False

def check_permission(request):
    key = request.data['key']
    check_key(key)

    operator = request.data['operator']
    check_name(operator)
    if not user_exists(operator):
        raise PermissionDenied({'error': 'Access Denied. Invalid operator.'})

    groups = get_user_groups(operator)
    if 'org-owner' not in groups and 'org-admin' not in groups:
        raise PermissionDenied({'error': 'Access Denied. Need org-owner or org-admin permission.'})

def log_sudo(sudo_cmd, username):
    now_string = datetime.now().isoformat()
    line = now_string + ': ' +  username + ': ' +  ' '.join(sudo_cmd)
    with open('/home/.org/sudo_logs', 'a') as file:
        file.write(line + '\n')
