#!/usr/bin/env python
# -*- coding:utf-8 -*-
# @Time     : 2017/3/24 0024 下午 15:22
# @Author   : ZhengZhong,Jiang
import xadmin

from .models import Course, Lesson, Video, CourseResource, BannerCourse
from organization.models import CourseOrg


# inline 表嵌套 只能嵌套一层, 但一层可以嵌套多个 课程机构与课程嵌套添加
class LessonInline(object):
    model = Lesson
    extra = 0


class CourseResourceInline(object):
    model = CourseResource
    extra = 0


class CourseAdmin(object):
    list_display = ['name', 'desc', 'detail', 'degree', 'learn_time', 'students',
                    'fav_nums', 'image', 'click_nums', 'add_time', 'get_lesson_nums', 'go_to']
    search_fields = ['name', 'desc', 'detail', 'degree', 'learn_time', 'students',
                    'fav_nums', 'image', 'click_nums']
    list_filter = ['name', 'desc', 'detail', 'degree', 'learn_time', 'students',
                    'fav_nums', 'image', 'click_nums', 'add_time']
    # 定义默认进入后台的排序
    ordering = ['-click_nums']
    # 定义字段只读 后台不可修改
    readonly_fields = ['fav_nums']
    # 设置字段后台不显示 与readonly_fields 冲突 不能重复定义
    exclude = ['click_nums']
    inlines = [LessonInline, CourseResourceInline]
    # 设置列表页可编辑
    list_editable = ['degree', 'desc']
    # 设置刷新
    refresh_times = [3, 5]

    # style_fields = {"detail": "ueditor"}
    import_excel = True

    def queryset(self):
        qs = super(CourseAdmin, self).queryset()
        qs = qs.filter(is_banner= False)
        return qs

    def save_models(self):
        # 在保存课程的时候统计课程机构的课程数
        obj = self.new_obj
        obj.save()
        if obj.course_org is not None:
            course_org = obj.course_org
            course_org.course_nums = Course.objects.filter(course_org=course_org).count()
            course_org.save()


    # 重载导入excel方法
    def post(self, request,  *args, **kwargs):
        if 'excel' in request.FILES:
            pass
        return super(CourseAdmin, self).post(request, args, kwargs)


class BannerCourseAdmin(object):
    list_display = ['name', 'desc', 'detail', 'degree', 'learn_time', 'students',
                    'fav_nums', 'image', 'click_nums', 'add_time']
    search_fields = ['name', 'desc', 'detail', 'degree', 'learn_time', 'students',
                    'fav_nums', 'image', 'click_nums']
    list_filter = ['name', 'desc', 'detail', 'degree', 'learn_time', 'students',
                    'fav_nums', 'image', 'click_nums', 'add_time']
    # 定义默认进入后台的排序
    ordering = ['-click_nums']
    # 定义字段只读 后台不可修改
    readonly_fields = ['fav_nums']
    # 设置字段后台不显示 与readonly_fields 冲突 不能重复定义
    exclude = ['click_nums']
    inlines = [LessonInline, CourseResourceInline]
    style_fields = {"detail": "ueditor"}

    # 重载queryset 方法
    def queryset(self):
        qs = super(BannerCourseAdmin, self).queryset()
        qs = qs.filter(is_banner= True)
        return qs

class LessonAdmin(object):
    list_display = ['course', 'name', 'add_time']
    search_fields = ['course', 'name']
    list_filter = ['course', 'name', 'add_time']


class VideoAdmin(object):
    list_display = ['lesson', 'name', 'add_time']
    search_fields = ['lesson', 'name']
    list_filter = ['lesson', 'name', 'add_time']


class CourseResourceAdmin(object):
    list_display = ['course', 'name', 'download', 'add_time']
    search_fields = ['course', 'name', 'download']
    list_filter = ['course', 'name', 'download', 'add_time']


xadmin.site.register(Course, CourseAdmin)
xadmin.site.register(BannerCourse, BannerCourseAdmin)
xadmin.site.register(Lesson, LessonAdmin)
xadmin.site.register(Video, VideoAdmin)
xadmin.site.register(CourseResource, CourseResourceAdmin)