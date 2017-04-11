# _*_ coding: utf-8 _*_
# @Author ZhengZhong,Jiang
# @DataTime 2017/4/1 0001 下午 15:07

from django.conf.urls import url, include

from .views import UserInfoView, UploadImageView, UpdatePwdView


urlpatterns = [
    url(r'^info/$', UserInfoView.as_view(), name='user_info'),
    url(r'^image/upload/$', UploadImageView.as_view(), name='image_upload'),
    url(r'^update/pwd/$', UpdatePwdView.as_view(), name='update_pwd'),
    url(r'^update/email/$', UpdatePwdView.as_view(), name='update_email'),
    url(r'^emailcode/$', UpdatePwdView.as_view(), name='email_code'),
]