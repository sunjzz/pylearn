# _*_ coding: utf-8 _*_
# @Author ZhengZhong,Jiang
# @DataTime 2017/4/1 0001 下午 15:07

from django.conf.urls import url, include

from .views import UserInfoView, UploadImageView, UpdatePwdView, SendEmailCodeView, UpdateEmailView
from .views import UserCourseView, UserFavView, UserMessageView


urlpatterns = [
    url(r'^info/$', UserInfoView.as_view(), name='user_info'),
    url(r'^image/upload/$', UploadImageView.as_view(), name='image_upload'),
    url(r'^update/pwd/$', UpdatePwdView.as_view(), name='update_pwd'),
    url(r'^update/email/$', UpdateEmailView.as_view(), name='update_email'),
    url(r'^emailcode/$', SendEmailCodeView.as_view(), name='email_code'),

    url(r'^course/$', UserCourseView.as_view(), name='user_course'),

    url(r'^fav/(?P<type_id>\d+)$', UserFavView.as_view(), name='user_fav'),

    url(r'^msg/$', UserMessageView.as_view(), name='user_msg'),
]