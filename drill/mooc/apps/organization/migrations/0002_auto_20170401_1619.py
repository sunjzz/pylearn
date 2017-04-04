# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2017-04-01 16:19
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('organization', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='courseorg',
            name='catgory',
            field=models.CharField(choices=[(b'pxjg', b'\xe5\x9f\xb9\xe8\xae\xad\xe6\x9c\xba\xe6\x9e\x84'), (b'gx', b'\xe9\xab\x98\xe6\xa0\xa1'), (b'gr', b'\xe4\xb8\xaa\xe4\xba\xba')], default=b'pxjg', max_length=20, verbose_name='\u673a\u6784\u7c7b\u522b'),
        ),
        migrations.AlterField(
            model_name='courseorg',
            name='image',
            field=models.ImageField(upload_to=b'org/%Y/%m', verbose_name=b'logo'),
        ),
    ]
