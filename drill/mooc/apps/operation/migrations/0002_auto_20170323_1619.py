# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('operation', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('course', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='userfavorite',
            name='user',
            field=models.ForeignKey(verbose_name='\u7528\u6237', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='usercourse',
            name='course',
            field=models.ForeignKey(verbose_name='\u8bfe\u7a0b', to='course.Course'),
        ),
        migrations.AddField(
            model_name='usercourse',
            name='user',
            field=models.ForeignKey(verbose_name='\u7528\u6237', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='coursecomment',
            name='course',
            field=models.ForeignKey(verbose_name='\u8bfe\u7a0b', to='course.Course'),
        ),
        migrations.AddField(
            model_name='coursecomment',
            name='user',
            field=models.ForeignKey(verbose_name='\u7528\u6237', to=settings.AUTH_USER_MODEL),
        ),
    ]
