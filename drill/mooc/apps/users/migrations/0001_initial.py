# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
import django.contrib.auth.models
import django.utils.timezone
import django.core.validators


class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0006_require_contenttypes_0002'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(null=True, verbose_name='last login', blank=True)),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, max_length=30, validators=[django.core.validators.RegexValidator('^[\\w.@+-]+$', 'Enter a valid username. This value may contain only letters, numbers and @/./+/-/_ characters.', 'invalid')], help_text='Required. 30 characters or fewer. Letters, digits and @/./+/-/_ only.', unique=True, verbose_name='username')),
                ('first_name', models.CharField(max_length=30, verbose_name='first name', blank=True)),
                ('last_name', models.CharField(max_length=30, verbose_name='last name', blank=True)),
                ('email', models.EmailField(max_length=254, verbose_name='email address', blank=True)),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('nick_name', models.CharField(default='', max_length=50, verbose_name='\u6635\u79f0')),
                ('brithday', models.DateField(null=True, verbose_name='\u751f\u65e5', blank=True)),
                ('gender', models.CharField(default=b'male', max_length=6, verbose_name='\u6027\u522b', choices=[(b'male', b'\xe7\x94\xb7'), (b'female', b'\xe5\xa5\xb3')])),
                ('address', models.CharField(default='', max_length=100, verbose_name='\u5730\u5740')),
                ('mobile', models.CharField(max_length=11, null=True, blank=True)),
                ('image', models.ImageField(default='image/default.png', upload_to=b'image/%Y/%m')),
                ('groups', models.ManyToManyField(related_query_name='user', related_name='user_set', to='auth.Group', blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(related_query_name='user', related_name='user_set', to='auth.Permission', blank=True, help_text='Specific permissions for this user.', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': '\u7528\u6237\u4fe1\u606f',
                'verbose_name_plural': '\u7528\u6237\u4fe1\u606f',
            },
            managers=[
                (b'objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Banner',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=100, verbose_name='\u6807\u9898')),
                ('image', models.ImageField(upload_to=b'banner/%Y/%m', verbose_name='\u8f6e\u64ad\u56fe')),
                ('url', models.URLField(verbose_name='\u8bbf\u95ee\u5730\u5740')),
                ('index', models.IntegerField(default=100, verbose_name='\u987a\u5e8f')),
                ('add_time', models.DateTimeField(default=datetime.datetime.now, verbose_name='\u6dfb\u52a0\u65f6\u95f4')),
            ],
            options={
                'verbose_name': '\u8f6e\u64ad\u56fe',
                'verbose_name_plural': '\u8f6e\u64ad\u56fe',
            },
        ),
        migrations.CreateModel(
            name='EmailVerifyRecord',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('code', models.CharField(max_length=20, verbose_name='\u9a8c\u8bc1\u7801')),
                ('email', models.EmailField(max_length=50, verbose_name='\u90ae\u7bb1')),
                ('send_type', models.CharField(max_length=10, choices=[(b'register', b'\xe6\xb3\xa8\xe5\x86\x8c'), (b'forget', b'\xe6\x89\xbe\xe5\x9b\x9e\xe5\xaf\x86\xe7\xa0\x81')])),
                ('send_time', models.DateField(default=datetime.datetime.now)),
            ],
            options={
                'verbose_name': '\u90ae\u7bb1\u9a8c\u8bc1\u7801',
                'verbose_name_plural': '\u90ae\u7bb1\u9a8c\u8bc1\u7801',
            },
        ),
    ]
