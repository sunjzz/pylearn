# _*_ coding: utf-8 _*_
# @Author ZhengZhong,Jiang
# @DataTime 2017/4/5 0005 下午 17:15

from django.conf.urls import url, include
from .views import OrgView, AddUserAskView, OrgHomeView, OrgCourseView, OrgDescView, OrgTeacherView, AddFavView, TeacherView

urlpatterns = [
    url(r'list/$', OrgView.as_view(), name="org_list"),
    url(r'add_ask/$', AddUserAskView.as_view(), name="add_ask"),
    url(r'^home/(?P<org_id>\d+)$', OrgHomeView.as_view(), name="org_home"),
    url(r'^course/(?P<org_id>\d+)$', OrgCourseView.as_view(), name="org_course"),
    url(r'^desc/(?P<org_id>\d+)$', OrgDescView.as_view(), name="org_desc"),
    url(r'^teacher/(?P<org_id>\d+)$', OrgTeacherView.as_view(), name="org_teacher"),

    # 机构收藏
    url(r'^add_fav/$', AddFavView.as_view(), name="add_fav"),
    url(r'^teacher_list/$', TeacherView.as_view(), name="teacher_list"),
]