from django.test import TestCase
from utils import email_send
from django.core.mail import send_mail



import os
os.environ['DJANGO_SETTINGS_MODULE'] = 'online.settings'


email_send.send_register_email()
# send_mail('Subject here', 'Here is the message.', 'zhengzhongbox@sina.com',    ['zhengzhongbox@sina.com'], fail_silently=False)
# Create your tests here.
