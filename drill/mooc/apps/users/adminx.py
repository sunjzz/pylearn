#!/usr/bin/env python
# -*- coding:utf-8 -*-
# @Time     : 2017/3/23 0023 下午 16:42
# @Author   : ZhengZhong,Jiang

import xadmin

from .models import EmailVerifyRecord, UserProfile

class EmailVerifyRecordAdmin(object):
    pass


class UserProfileAdmin(object):
    pass

xadmin.site.register(EmailVerifyRecord, EmailVerifyRecordAdmin)
xadmin.site.register(UserProfile, UserProfileAdmin)