# _*_ coding: utf-8 _*_
# @Author ZhengZhong,Jiang
# @DataTime 2017/4/5 0005 下午 17:15

from django.conf.urls import url, include
from .views import OrgView, AddUserAskView

urlpatterns = [
    url(r'list/$', OrgView.as_view(), name="org_list"),
    url(r'add_ask/$', AddUserAskView.as_view(), name="add_ask"),
]