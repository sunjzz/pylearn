# _*_ coding: utf-8 _*_

# Create your views here.
import json

from django.shortcuts import render,HttpResponse
from django.contrib.auth import authenticate, login
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.hashers import make_password
from django.db.models import Q

from django.views.generic.base import View

import models
from forms import LoginForm,RegisterForm,ForgetForm,ModifyPwdForm, UpdateUserEmailForm
from utils.email_send import send_register_email
from utils.mixin_utils import LoginRequiredMixin

from .models import UserProfile
from .forms import UploadImageForm, UpdateUserInfoForm


class CustomBackend(ModelBackend):
    def authenticate(self, username=None, password=None, **kwargs):
        try:
            user = models.UserProfile.objects.get(Q(username=username)|Q(email=username))
            if user.check_password(password):
                return user
        except Exception as e:
            return None


class ActiveUserView(View):
    def get(self,request, active_code):
        all_records = models.EmailVerifyRecord.objects.filter(code=active_code)
        if all_records:
            for record in all_records:
                email = record.email
                user = models.UserProfile.objects.get(email=email)
                user.is_active = True
                user.save()
        return render(request, 'index.html', {})


class RegisterView(View):
    def get(self, request):
        register_form = RegisterForm()
        return render(request, 'register.html', {'register_form': register_form})

    def post(self, request):
        register_form = RegisterForm(request.POST)
        if register_form.is_valid():
            user_name = request.POST.get("email", "")
            if models.UserProfile.objects.filter(email=user_name):
                return render(request, "register.html", {"register_form": register_form, "msg":"用户已经存在！"})
            pass_word = request.POST.get("password", "")
            user_profile = models.UserProfile()
            user_profile.username = user_name
            user_profile.email = user_name
            user_profile.password = make_password(pass_word)
            user_profile.save()
            send_register_email(user_name, "register")
            return render(request, "login.html")
        return render(request, 'register.html', {"register_form": register_form})


class LoginView(View):
    def get(self, request):
        return render(request, 'login.html', {})

    def post(self, request):
        login_form = LoginForm(request.POST)
        if login_form.is_valid():
            user_name = request.POST.get("username", "")
            pass_word = request.POST.get("password", "")
            user = authenticate(username=user_name, password=pass_word)
            if user is not None:
                if user.is_active:
                    login(request, user)
                    return render(request, "index.html", {})
                else:
                    return render(request, "login.html", {"msg": "用户名或密码错误！"})
            else:
                return render(request, "login.html", {"msg": "用户名或密码错误！"})
        else:
            return render(request, "login.html", {"msg": "用户名或密码错误！", "login_form": login_form})


class ForgetPwdView(View):
    def get(self, request):
        forget_form = ForgetForm()
        return render(request, "forgetpwd.html", {"forget_form": forget_form})

    def post(self, request):
        forget_form = ForgetForm(request.POST)
        if forget_form.is_valid():
            email = request.POST.get("email", "")
            send_register_email(email, 'forget')
            return render(request, 'send_success.html')


class ResetView(View):
    def get(self, request, forget_code):
        record = models.EmailVerifyRecord.objects.filter(code=forget_code).get()
        if record:
            email = record.email
            return render(request, 'password_reset.html', {'email': email})
        else:
            return HttpResponse('密码重置链接无效！')


class ModifyPwdView(View):
    '''
    修改用户密码
    '''
    def post(self, request):
        modify_form = ModifyPwdForm(request.POST)
        email = request.POST.get("email", "")
        if modify_form.is_valid():
            pwd1 = request.POST.get("password1", "")
            pwd2 = request.POST.get("password2", "")
            if pwd1 != pwd2:
                return render(request, "password_reset.html", {"email": email, "msg": "密码不一致！"})
            user = models.UserProfile.objects.filter(Q(username=email)|Q(email=email)).get()
            if user:
                user.password = make_password(pwd2)
                user.save()
                return render(request, "login.html")
        else:
            return render(request, "password_reset.html", {"email": email, "modify_form": modify_form})


class UserInfoView(LoginRequiredMixin, View):
    def get(self, request, *args, **kwargs):
        user = UserProfile.objects.get(id = int(request.user.id))
        return render(request, 'usercenter-info.html', {
            "user": user
        })

    def post(self, request, *args, **kwargs):
        user_form = UpdateUserInfoForm(request.POST, instance=request.user)
        if user_form.is_valid():
            user_form.save()
        return HttpResponse('{"status": "success"}', content_type='application/json')

        # user = UserProfile.objects.get(id=int(request.user.id))
        # user.nick_name = request.POST.get('nick_name', user.nick_name)
        # user.brithday = request.POST.get('birth_day', user.brithday)
        # user.gender = request.POST.get('gender', user.gender)
        # user.address = request.POST.get('address', user.address)
        # user.mobile = request.POST.get('mobile', user.mobile)
        # user.email = request.POST.get('email', user.email)
        # user.save()
        # return render(request, 'usercenter-info.html', {
        #     'user': user
        # })


class UploadImageView(View):
    """
    用户修改图像
    """
    def post(self, request):
        """
        方法一：
        :param request: 
        :return: 
        """
        image_form = UploadImageForm(request.POST, request.FILES)
        if image_form.is_valid():
            image = image_form.cleaned_data['image']
            request.user.image = image
            request.user.save()
            return HttpResponse('{"status": "success"}',  content_type='application/json')
        else:
            return HttpResponse('{"status": "fail"}', content_type='application/json')


        # 方法二：
        # image_form = UploadImageForm(request.POST, request.FILES, instance=request.user)
        # if image_form.is_valid():
        #     image_form.save()
        #     return HttpResponse('{"status": "success"}',  content_type='application/json')
        # else:
        #     return HttpResponse('{"status": "fail"}', content_type='application/json')


class UpdatePwdView(View):
    def post(self, request):
        modify_form = ModifyPwdForm(request.POST)
        if modify_form.is_valid():
            pwd1 = request.POST.get("password1", "")
            pwd2 = request.POST.get("password2", "")
            if pwd1 != pwd2:
                return HttpResponse('{"status": "fail", "msg": "密码不一致！"}',  content_type='application/json')
            user = request.user
            user.password = make_password(pwd2)
            user.save()
            return HttpResponse('{"status": "success"}',  content_type='application/json')
        else:
            return HttpResponse(json.dumps(modify_form.errors), content_type='application/json')


class SendEmailCodeView(LoginRequiredMixin, View):
    def post(self, request):
        email = request.POST.get("email", "")
        if models.UserProfile.objects.filter(email=email):
            return HttpResponse('{"msg": "邮箱已经存在！"}', content_type='application/json')
        if email:
            send_register_email(email, "update")
            return HttpResponse('{"status": "success"}',  content_type='application/json')



class UpdateEmailView(View):
    def post(self, request):
        update_email = UpdateUserEmailForm(request.POST, instance=request.user)
        if update_email.is_valid():
            update_email.save()
            return HttpResponse('{"status": "success"}', content_type='application/json')
        else:
            return HttpResponse('{"status": "fail"}', content_type='application/json')