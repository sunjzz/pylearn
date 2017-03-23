# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='emailverifyrecord',
            name='send_time',
            field=models.DateTimeField(default=datetime.datetime.now, verbose_name='\u53d1\u9001\u65f6\u95f4'),
        ),
        migrations.AlterField(
            model_name='emailverifyrecord',
            name='send_type',
            field=models.CharField(max_length=10, verbose_name='\u9a8c\u8bc1\u7801\u7c7b\u578b', choices=[(b'register', b'\xe6\xb3\xa8\xe5\x86\x8c'), (b'forget', b'\xe6\x89\xbe\xe5\x9b\x9e\xe5\xaf\x86\xe7\xa0\x81')]),
        ),
    ]
