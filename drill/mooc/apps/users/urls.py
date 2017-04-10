# _*_ coding: utf-8 _*_
# @Author ZhengZhong,Jiang
# @DataTime 2017/4/1 0001 下午 15:07

from django.conf.urls import url, include

from .views import UserInfoView


urlpatterns = [
    url(r'^info/$', UserInfoView.as_view(), name='user_info'),
    url(r'^image/upload/$', UserInfoView.as_view(), name='image_upload'),
]