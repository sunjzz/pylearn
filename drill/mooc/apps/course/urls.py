# _*_ coding: utf-8 _*_
# @Author ZhengZhong,Jiang
# @DataTime 2017/4/7 0007 下午 13:04

from django.conf.urls import url, include

from .views import CourseListView, CourseDetailView

urlpatterns = [
    url(r'list/$', CourseListView.as_view(), name="course_list"),
    url(r'list/(?P<course_id>\d+)/$', CourseDetailView.as_view(), name="course_detail"),

]