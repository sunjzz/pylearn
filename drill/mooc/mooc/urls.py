from django.conf.urls import include, url
from django.contrib import admin
from django.views.generic import TemplateView

import xadmin


from users.views import LoginView

urlpatterns = [
    # Examples:
    # url(r'^$', 'mooc.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^xadmin/', include(xadmin.site.urls)),
    url('^$', TemplateView.as_view(template_name="index.html"), name="index"),
    url(r'^login/$', LoginView.as_view(), name= "login"),
    # url('^register/$', RegisterView.as_view(), name="register"),


]
