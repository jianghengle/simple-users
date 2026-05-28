from rest_framework.exceptions import PermissionDenied
import random, string, re
import os, subprocess
from datetime import datetime, timedelta

DEFAULT_GROUPS = ['postmaster', 'root', 'all']
ORG_ALIASES = '/home/.org/aliases'

def run_cmd(cmd):
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True, check=True)
    return result.stdout

def get_user_groups(username):
    result = run_cmd('groups ' + username)
    ss = result.strip().split(':')
    names = ss[len(ss) - 1].strip().split(' ')
    groups = []
    for name in names:
        if name.strip():
            groups.append(name.strip())
    return groups

def get_group_users(group):
    result = run_cmd('getent group ' + group)
    ss = result.strip().split(':')
    names = ss[len(ss) - 1].split(',')
    users = []
    for name in names:
        if name.strip():
            users.append(name.strip())
    return users

def get_locked_users():
    cmd = 'sudo passwd -S -a | grep " L "'
    result = run_cmd(cmd)
    users = []
    for line in result.split('\n'):
        if line.strip():
            ss = line.strip().split(' ')
            users.append(ss[0])
    return users

def get_users_status(users):
    cmd = 'sudo cat /etc/shadow'
    result = run_cmd(cmd)
    status = {}
    for line in result.split('\n'):
        if line.strip():
            ss = line.strip().split(':')
            if ss[0] in users:
                if ss[1] == '!':
                    status[ss[0]] = 'password not set'
                elif ss[1].startswith('!$'):
                    status[ss[0]] = 'locked'
                elif ss[1].startswith('$') and len(ss[1]) > 6:
                    status[ss[0]] = 'active'
                else:
                    status[ss[0]] = 'unknown'
    return status

def get_user_fullnames(users):
    cmd = 'cat /etc/passwd'
    result = run_cmd(cmd)
    fullnames = {}
    for line in result.split('\n'):
        if line.strip():
            ss = line.strip().split(':')
            if ss[0] in users:
                fullname = ss[4].split(',')[0]
                fullnames[ss[0]] = fullname
    return fullnames

def file_exists(path):
    try:
        run_cmd('ls ' + path)
        return True
    except:
        return False

def check_token(username, token):
    file_path = '/home/.org/' + username + '_session'
    if not file_exists(file_path):
        raise PermissionDenied({'error': 'Access Denied. No file.'})

    timestamp = os.path.getmtime(file_path)
    modified_date = datetime.fromtimestamp(timestamp)
    now = datetime.now()
    if now > modified_date + timedelta(days=1):
        raise PermissionDenied({'error': 'Session expired.'})
    if run_cmd('cat ' + file_path).strip() != token:
        raise PermissionDenied({'error': 'Access Denied. Invalid token.'})

def check_name(name):
    pattern = r'^[a-z][-a-z0-9_]*$'
    match = re.fullmatch(pattern, name)
    if not match:
        raise PermissionDenied({'error': 'Invalid name.'})

def check_quote(text):
    if '"' in text or "'" in text:
        raise PermissionDenied({'error': 'Contains invalid quotes.'})

def check_space_or_quote(text):
    found = re.search(r"\s", text) or '"' in text or "'" in text
    if found:
        raise PermissionDenied({'error': 'Contains invalid charactors.'})

def user_exists(username):
    try:
        run_cmd('id ' + username)
        return True
    except:
        return False

def check_user_permission(request):
    username = request.data['username']
    check_name(username)
    if not user_exists(username):
        raise PermissionDenied({'error': 'Access Denied. Invalid username.'})

    token = request.data['token']
    check_token(username, token)

    groups = get_user_groups(username)
    if 'org-user' not in groups:
        raise PermissionDenied({'error': 'Access Denied. Not in user group.'})
    return groups

def check_admin_permission(request):
    groups = check_user_permission(request)
    if 'org-owner' not in groups and 'org-admin' not in groups:
        raise PermissionDenied({'error': 'Access Denied. Need org-owner or org-admin permission.'})
    return groups

def log_sudo(sudo_cmd, username):
    now_string = datetime.now().isoformat()
    line = now_string + ': ' +  username + ': ' +  ' '.join(sudo_cmd)
    with open('/home/.org/sudo_logs', 'a') as file:
        file.write(line + '\n')

def get_group_mail_users():
    group_users = []
    with open(ORG_ALIASES, 'r') as file:
        for line in file:
            if line.startswith('#'):
                continue
            if not line.strip():
                continue
            if ':' not in line:
                continue
            (key, value) = line.strip().split(':')
            group = key.strip()
            if group in DEFAULT_GROUPS and group != 'all':
                continue
            users = []
            for v in value.strip().split(','):
                if v.strip():
                    users.append(v.strip())
            group_users.append({'group': group, 'users': users})
    return group_users

def add_user_to_mail_group(user, group):
    new_lines = []
    with open(ORG_ALIASES, 'r') as file:
        changed = False
        group_found = False
        for line in file:
            if line.startswith('#') or (not line.strip()) or (':' not in line):
                new_lines.append(line.strip())
                continue
            (key, value) = line.strip().split(':')
            if group != key.strip():
                new_lines.append(line.strip())
                continue
            group_found = True
            users = []
            for v in value.strip().split(','):
                if v.strip():
                    users.append(v.strip())
            if user in users:
                new_lines.append(line.strip())
            else:
                users.append(user)
                new_line = group + ': ' + (', '.join(users))
                new_lines.append(new_line)
                changed = True
        if not group_found:
            new_line = group + ': ' + user
            new_lines.append(new_line)
            changed = True
    
    if changed:
        with open(ORG_ALIASES, 'w') as file:
            file.write('\n'.join(new_lines))
        overwrite_aliases()

def remove_user_from_mail_group(user, group):
    new_lines = []
    with open(ORG_ALIASES, 'r') as file:
        changed = False
        for line in file:
            if line.startswith('#') or (not line.strip()) or (':' not in line):
                new_lines.append(line.strip())
                continue
            (key, value) = line.strip().split(':')
            if group != key.strip():
                new_lines.append(line.strip())
                continue
            users = []
            for v in value.strip().split(','):
                if v.strip():
                    users.append(v.strip())
            if user in users:
                users.remove(user)
                changed = True
                if not users:
                    continue
                new_line = group + ': ' + (', '.join(users))
                new_lines.append(new_line)
            else:
                new_lines.append(line.strip())
    
    if changed:
        with open(ORG_ALIASES, 'w') as file:
            file.write('\n'.join(new_lines))
        overwrite_aliases()


def remove_mail_group(group):
    new_lines = []
    with open(ORG_ALIASES, 'r') as file:
        changed = False
        for line in file:
            if line.startswith('#') or (not line.strip()) or (':' not in line):
                new_lines.append(line.strip())
                continue
            (key, value) = line.strip().split(':')

            if group == key.strip():
                changed = True
            else:
                new_lines.append(line.strip())
    if changed:
        with open(ORG_ALIASES, 'w') as file:
            file.write('\n'.join(new_lines))
        overwrite_aliases()


def overwrite_aliases():
    sudo_cmd = 'sudo cp ' + ORG_ALIASES + ' /etc/'
    run_cmd(sudo_cmd)
    sudo_cmd = 'sudo newaliases'
    run_cmd(sudo_cmd)
