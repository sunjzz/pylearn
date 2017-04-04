#!/usr/bin/env python
# -*- coding:utf-8 -*-
# @Time     : 2017/3/24 0024 下午 16:24
# @Author   : ZhengZhong,Jiang
import xadmin

from .models import CityDict, CourseOrg, Teacher

class CityDictAdmin(object):
    list_display = ['name', 'desc', 'add_time']
    search_fields = ['name', 'desc']
    list_filter = ['name', 'desc', 'add_time']


class CourseOrgAdmin(object):
    list_display = ['name', 'desc', 'category', 'click_nums','fav_nums', 'image', 'address', 'city', 'add_time']
    search_fields = ['name', 'desc', 'category', 'click_nums','fav_nums', 'image', 'address', 'city']
    list_filter = ['name', 'desc', 'category', 'click_nums','fav_nums', 'image', 'address', 'city', 'add_time']


class TeacherAdmin(object):
    list_display = ['org', 'name', 'work_years', 'work_company', 'work_position', 'points',
                    'click_nums', 'fav_nums', 'add_time']
    search_fields = ['org', 'name', 'work_years', 'work_company', 'work_position', 'points',
                    'click_nums', 'fav_nums']
    list_filter = ['org', 'name', 'work_years', 'work_company', 'work_position', 'points',
                    'click_nums', 'fav_nums', 'add_time']


xadmin.site.register(CityDict, CityDictAdmin)
xadmin.site.register(CourseOrg, CourseOrgAdmin)
xadmin.site.register(Teacher, TeacherAdmin)