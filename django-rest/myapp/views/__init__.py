from rest_framework.exceptions import PermissionDenied
import random, string
import subprocess
import os


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
        run_cmd(['sudo', 'ls', path])
        return True
    except:
        return False


def check_admin_or_owner(request):
    operator = request.data['operator']
    operator_key = request.data['operatorKey']
    groups = get_user_groups(operator)
    if 'org-owner' not in groups and 'org-admin' not in groups:
        raise PermissionDenied({'error': 'Access Denied. Need org-owner or org-admin permission.'})
    key_path = '/home/.org/' + operator + '/key'
    if not file_exists(key_path):
        raise PermissionDenied({'error': 'Access Denied. Invalid Operator Key.'})
    if run_cmd(['sudo', 'cat', key_path]).strip() != operator_key:
        raise PermissionDenied({'error': 'Access Denied. Invalid Operator Key.'})
