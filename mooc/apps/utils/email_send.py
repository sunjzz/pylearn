# _*_ coding: utf-8 _*_
# @Author ZhengZhong,Jiang
# @DataTime 2017/3/30 0030 下午 16:25
import os
from random import Random
from django.core.mail import send_mail

from users.models import EmailVerifyRecord
from mooc.settings import EMAIL_FROM

os.environ['DJANGO_SETTINGS_MODULE'] = 'mooc.settings'


def send_register_email(email, send_type="register"):
    email_record = EmailVerifyRecord()
    random_str = generic_random_str(16)

    email_title = ""
    email_body = ""


    if send_type == 'register':
        email_title = u"注册激活链接"
        email_body = u"请点击下面链接激活账号：http://127.0.0.1:8000/active/{0}".format(random_str)
    elif send_type == 'forget':
        email_title = u"重置密码链接"
        email_body = u"请点击下面链接重置密码：http://127.0.0.1:8000/reset/{0}".format(random_str)
    elif send_type == 'update':
        random_str = generic_random_str(8)
        email_title = u"修改邮箱地址验证码"
        email_body = u"验证码：{0}".format(random_str)
    email_record.code = random_str
    email_record.email = email
    email_record.send_type = send_type
    email_record.save()
    send_status = send_mail(email_title, email_body, EMAIL_FROM, [email], )
    if send_status:
        return random_str



def generic_random_str(randomlength=8):
    str = ''
    chars = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789'
    length = len(chars) - 1
    random = Random()
    for i in range(randomlength):
        str += chars[random.randint(0, length)]
    return str