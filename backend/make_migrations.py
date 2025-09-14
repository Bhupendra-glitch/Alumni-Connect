#!/usr/bin/env python
"""
Script to create Django migrations
Run this after installing Python and Django
"""

import os
import sys
import django
from django.core.management import execute_from_command_line

if __name__ == '__main__':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'alumni_connect.settings')
    django.setup()
    
    # Create migrations
    execute_from_command_line(['manage.py', 'makemigrations'])
    execute_from_command_line(['manage.py', 'migrate'])
    execute_from_command_line(['manage.py', 'createsuperuser'])

