from django.conf.urls import include, url
from django.contrib import admin
from django.views.generic import TemplateView
from django.views.static import serve #

import xadmin


from users.views import LoginView, RegisterView,ActiveUserView,ForgetPwdView,ResetView,ModifyPwdView
from organization.views import OrgView

from mooc.settings import MEDIA_ROOT


urlpatterns = [
    # Examples:
    # url(r'^$', 'mooc.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^xadmin/', include(xadmin.site.urls)),
    url('^$', TemplateView.as_view(template_name="index.html"), name="index"),
    url(r'^login/$', LoginView.as_view(), name= "login"),
    url(r'^register/$', RegisterView.as_view(), name="register"),
    url(r'^captcha/', include('captcha.urls')),
    url(r'^active/(?P<active_code>.*)/$', ActiveUserView.as_view(), name="user_active"),
    url(r'^forget/$', ForgetPwdView.as_view(), name="forget_user"),
    url(r'^reset/(?P<forget_code>.*)/$', ResetView.as_view(), name="reset_pwd"),
    url(r'^modify_pwd/$', ModifyPwdView.as_view(), name="modify_pwd"),

    #course org list
    url(r'^org/', include('organization.urls', namespace="org")),

    # course org list
    url(r'^course/', include('course.urls', namespace="course")),

    # config upload files access path.
    url(r'^media/(?P<path>.*)/$', serve, {"document_root": MEDIA_ROOT})
]
