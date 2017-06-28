# -*- coding: utf-8 -*-
# @author ZhengZhong,Jiang
# @time 2017/6/13 0013 下午 16:14

from django.conf.urls import url, include
from django.contrib import admin
from books.views import SearchBookView, AcmeBookList, BookList
from books.views import search

urlpatterns = [
    url(r'^search/', SearchBookView.as_view(), name='search'),
    url(r'^booklist/', BookList.as_view(), name='booklist'),
    url(r'^acmelist/', AcmeBookList.as_view(), name='acmelist'),
    # url(r'^search', search)
]