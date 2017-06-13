# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Create your models here.


class Publisher(models.Model):
    name = models.CharField(max_length=30, verbose_name=u'出版社')
    address = models.CharField(max_length=50, verbose_name=u'所在地址')
    city = models.CharField(max_length=60, verbose_name=u'所在城市')
    state_province = models.CharField(max_length=30, verbose_name=u'所在省份')
    country = models.CharField(max_length=50, verbose_name=u'所在国家')
    website = models.URLField()

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']
        verbose_name = u'出版社表'
        verbose_name_plural = u'出版社表'


class Author(models.Model):
    first_name = models.CharField(max_length=30, verbose_name=u'名字')
    last_name = models.CharField(max_length=40, verbose_name=u'姓氏')
    email = models.EmailField()

    def __str__(self):
        return u'%s %s' % (self.first_name, self.last_name)

    class Meta:
        verbose_name = u'著作者表'
        verbose_name_plural = u'著作者表'


class Book(models.Model):
    title = models.CharField(max_length=100, verbose_name=u'书名')
    authors = models.ManyToManyField(Author, verbose_name=u'作者')
    publisher = models.ForeignKey(Publisher, verbose_name=u'出版机构')
    publication_date = models.DateField(blank=True, null=True, verbose_name=u'出版日期')

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = u'书籍表'
        verbose_name_plural = u'书籍表'
