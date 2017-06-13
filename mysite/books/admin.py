# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

from books.models import Publisher, Author, Book

# Register your models here.


class AuthorAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email')
    search_fields = ('first_name', 'last_name', 'email')


class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'publisher', 'publication_date')
    list_filter = ('publication_date', 'publisher')  # 该过滤器可以处理DateField，BooleanField，ForeignKey字段
    date_hierarchy = 'publication_date'  # 修改列表上面显示一个日期层级导航栏，先显示年份，向下限制月份和天
    ordering = ('-publication_date',)
    # fields = ('title', 'authors', 'publisher', 'publication_date')
    filter_horizontal = ('authors',)  # 多对多选择，选择框横向排列，filter_vertical 选择框纵向排列
    raw_id_fields = ('publisher',)  # 把外键字段的select方式改成text，（主键过多，加载时间长，select方式费劲）


admin.site.register(Publisher)
admin.site.register(Author, AuthorAdmin)
admin.site.register(Book, BookAdmin)
