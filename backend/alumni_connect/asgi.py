"""
ASGI config for alumni_connect project.
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'alumni_connect.settings')

application = get_asgi_application()

