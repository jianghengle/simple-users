from rest_framework.exceptions import PermissionDenied
import random, string
import subprocess


def get_random_string(n):
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=n))


def run_cmd(cmd):
    result = subprocess.run(cmd, capture_output=True, text=True, check=True)
    return result.stdout
