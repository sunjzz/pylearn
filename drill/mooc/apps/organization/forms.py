# _*_ coding: utf-8 _*_
# @Author ZhengZhong,Jiang
# @DataTime 2017/4/5 0005 下午 17:02

from django import forms
from operation.models import UserAsk


# class UserAskForm(forms.Form):
#     name = forms.CharField(required=True,  min_length=2, max_length=20)
#     phone = forms.CharField(required=True, min_length=11, max_length=)
#     course_name = forms.CharField(required=True, min_length=5, max_length=50)


class UserAskForm(forms.ModelForm):
    class Meta:
        model = UserAsk
        fields = ['name', 'mobile', 'course_name']