# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.utils.timezone
import django.db.models.deletion
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Bookmark',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=128, verbose_name='Title')),
                ('url_name', models.CharField(max_length=64, verbose_name='Url Name')),
                ('query', models.CharField(max_length=1000, verbose_name='Query String', blank=True)),
                ('is_share', models.BooleanField(default=False, verbose_name='Is Shared')),
                ('content_type', models.ForeignKey(to='contenttypes.ContentType')),
                ('user', models.ForeignKey(verbose_name='user', blank=True, to=settings.AUTH_USER_MODEL, null=True)),
            ],
            options={
                'verbose_name': 'Bookmark',
                'verbose_name_plural': 'Bookmarks',
            },
        ),
        migrations.CreateModel(
            name='Log',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('action_time', models.DateTimeField(default=django.utils.timezone.now, verbose_name='action time', editable=False)),
                ('ip_addr', models.GenericIPAddressField(null=True, verbose_name='action ip', blank=True)),
                ('object_id', models.TextField(null=True, verbose_name='object id', blank=True)),
                ('object_repr', models.CharField(max_length=200, verbose_name='object repr')),
                ('action_flag', models.CharField(max_length=32, verbose_name='action flag')),
                ('message', models.TextField(verbose_name='change message', blank=True)),
                ('content_type', models.ForeignKey(verbose_name='content type', to_field=django.db.models.deletion.SET_NULL, blank=True, to='contenttypes.ContentType', null=True)),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL, to_field=django.db.models.deletion.CASCADE, verbose_name='user')),
            ],
            options={
                'ordering': ('-action_time',),
                'verbose_name': 'log entry',
                'verbose_name_plural': 'log entries',
            },
        ),
        migrations.CreateModel(
            name='UserSettings',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('key', models.CharField(max_length=256, verbose_name='Settings Key')),
                ('value', models.TextField(verbose_name='Settings Content')),
                ('user', models.ForeignKey(verbose_name='user', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'User Setting',
                'verbose_name_plural': 'User Settings',
            },
        ),
        migrations.CreateModel(
            name='UserWidget',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('page_id', models.CharField(max_length=256, verbose_name='Page')),
                ('widget_type', models.CharField(max_length=50, verbose_name='Widget Type')),
                ('value', models.TextField(verbose_name='Widget Params')),
                ('user', models.ForeignKey(verbose_name='user', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'User Widget',
                'verbose_name_plural': 'User Widgets',
            },
        ),
    ]
