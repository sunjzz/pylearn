from django.conf.urls import include, url
from django.contrib import admin
from django.views.generic import TemplateView

import xadmin


from users.views import user_login

urlpatterns = [
    # Examples:
    # url(r'^$', 'mooc.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^xadmin/', include(xadmin.site.urls)),
    url('^$', TemplateView.as_view(template_name = "index.html"), name= "index"),
    url(r'^login/$', user_login, name= "login")
]
