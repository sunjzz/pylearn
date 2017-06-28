# -*- coding: utf-8 -*-
# Generated by Django 1.10.2 on 2016-11-08 10:11
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0008_alter_user_username_max_length'),
        ('assets', '0002_auto_20160706_0718'),
    ]

    operations = [
        migrations.CreateModel(
            name='SecurityDevice',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sub_asset_type', models.SmallIntegerField(choices=[(0, '防火墙'), (1, '入侵检测设备'), (2, '互联网网关'), (4, '运维审计系统')], default=0, verbose_name='服务器类型')),
            ],
        ),
        migrations.RenameField(
            model_name='cpu',
            old_name='cpu_model',
            new_name='model',
        ),
        migrations.RemoveField(
            model_name='disk',
            name='manufactory',
        ),
        migrations.RemoveField(
            model_name='networkdevice',
            name='create_date',
        ),
        migrations.RemoveField(
            model_name='networkdevice',
            name='model',
        ),
        migrations.RemoveField(
            model_name='networkdevice',
            name='sn',
        ),
        migrations.RemoveField(
            model_name='networkdevice',
            name='update_date',
        ),
        migrations.RemoveField(
            model_name='server',
            name='create_date',
        ),
        migrations.RemoveField(
            model_name='server',
            name='model',
        ),
        migrations.RemoveField(
            model_name='server',
            name='update_date',
        ),
        migrations.RemoveField(
            model_name='software',
            name='distribution',
        ),
        migrations.RemoveField(
            model_name='software',
            name='language',
        ),
        migrations.RemoveField(
            model_name='software',
            name='type',
        ),
        migrations.AddField(
            model_name='asset',
            name='model',
            field=models.CharField(blank=True, max_length=128, null=True, verbose_name='型号'),
        ),
        migrations.AddField(
            model_name='networkdevice',
            name='sub_asset_type',
            field=models.SmallIntegerField(choices=[(0, '路由器'), (1, '交换机'), (2, '负载均衡'), (4, 'VPN设备')], default=0, verbose_name='服务器类型'),
        ),
        migrations.AddField(
            model_name='server',
            name='sub_asset_type',
            field=models.SmallIntegerField(choices=[(0, 'PC服务器'), (1, 'PC服务器'), (2, '小型机')], default=0, verbose_name='服务器类型'),
        ),
        migrations.AddField(
            model_name='software',
            name='license_num',
            field=models.IntegerField(default=1, verbose_name='授权数'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='userprofile',
            name='is_superuser',
            field=models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status'),
        ),
        migrations.AddField(
            model_name='userprofile',
            name='user_permissions',
            field=models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.Permission', verbose_name='user permissions'),
        ),
        migrations.AlterField(
            model_name='asset',
            name='asset_type',
            field=models.CharField(choices=[('server', '服务器'), ('network_device', '网络设备'), ('storage_device', '存储设备'), ('security_device', '安全设备'), ('security_device', '机房设备'), ('software', '软件资产')], default='server', max_length=64),
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='name',
            field=models.CharField(max_length=32),
        ),
        migrations.AlterUniqueTogether(
            name='nic',
            unique_together=set([('asset', 'macaddress')]),
        ),
        migrations.AddField(
            model_name='securitydevice',
            name='asset',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='assets.Asset'),
        ),
    ]
