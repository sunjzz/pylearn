from django.conf.urls import include, url
from django.contrib import admin

import xadmin

urlpatterns = [
    # Examples:
    # url(r'^$', 'mooc.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^xadmin/', include(xadmin.site.urls)),
]
