# _*_ coding: utf-8 _*_
# @Author ZhengZhong,Jiang
# @DataTime 2017/4/1 0001 下午 15:07

from django.conf.urls import url, include

from .views import UserinfoView


urlpatterns = [
    url(r'info/$', UserinfoView.as_view(), name='user_info')
]