# -*- coding: utf-8 -*-
# @author ZhengZhong,Jiang
# @time 2017/6/13 0013 下午 17:45

from django import forms

class ContactForm(forms.Form):
    subject = forms.CharField()
    email = forms.EmailField(required=False)
    message = forms.CharField()