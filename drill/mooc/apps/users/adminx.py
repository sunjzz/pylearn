#!/usr/bin/env python
# -*- coding:utf-8 -*-
# @Time     : 2017/3/23 0023 下午 16:42
# @Author   : ZhengZhong,Jiang

import xadmin
from xadmin import  views


from .models import EmailVerifyRecord, Banner, UserProfile


class BaseSetting(object):
    enable_themes = True #启用主题
    use_bootswatch = True


class GlobalSetting(object):
    site_title = u"在线视频管理系统" #页面和左上角title
    site_footer = u"CCVT" #页脚
    menu_style = "accordion" #左侧栏收缩功能



class EmailVerifyRecordAdmin(object):
    list_display = ['code', 'email', 'send_type', 'send_time']
    search_fields = ['code', 'email']
    list_filter = ['code', 'email', 'send_type', 'send_time']


class BannerAdmin(object):
    list_display = ['title', 'image', 'url', 'index', 'add_time']
    search_fields = ['title', 'image', 'url', 'index']
    list_filter = ['title', 'image', 'url', 'index', 'add_time']



xadmin.site.register(EmailVerifyRecord, EmailVerifyRecordAdmin)
xadmin.site.register(Banner, BannerAdmin)
xadmin.site.register(views.BaseAdminView, BaseSetting)
xadmin.site.register(views.CommAdminView, GlobalSetting)