# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2017-04-10 11:12
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('organization', '0006_teacher_age'),
    ]

    operations = [
        migrations.AddField(
            model_name='teacher',
            name='desc',
            field=models.CharField(default=b'', max_length=200, verbose_name='\u6559\u5e08\u63cf\u8ff0'),
        ),
    ]
