# _*_ coding: utf-8 _*_

# Create your views here.
import json

from django.shortcuts import render,HttpResponse,HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.hashers import make_password
from django.db.models import Q
from django.views.generic.base import View
from django.core.urlresolvers import reverse

from pure_pagination import Paginator, EmptyPage, PageNotAnInteger

import models
from forms import LoginForm, RegisterForm, ForgetForm, ModifyPwdForm, UpdateUserEmailForm
from utils.email_send import send_register_email
from utils.mixin_utils import LoginRequiredMixin

from .models import UserProfile
from .forms import UploadImageForm, UpdateUserInfoForm
from operation.models import UserCourse, UserFavorite, UserMessage
from organization.models import CourseOrg, Teacher
from course.models import Course


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
            if models.UserProfile.objects.filter(Q(email=user_name), Q(username=user_name)):
                return render(request, "register.html", {"register_form": register_form, "msg":"用户已经存在！"})
            pass_word = request.POST.get("password", "")
            user_profile = models.UserProfile()
            user_profile.username = user_name
            user_profile.email = user_name
            user_profile.password = make_password(pass_word)
            user_profile.save()

            #写入注册消息
            user_msg = UserMessage()
            user_msg.user = models.UserProfile.objects.get(Q(email=user_name), Q(username=user_name))
            user_msg.message = "欢迎注册！"
            user_msg.save()

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
                    return HttpResponseRedirect(reverse('index'))
                else:
                    return render(request, "login.html", {"msg": "用户名或密码错误！"})
            else:
                return render(request, "login.html", {"msg": "用户名或密码错误！"})
        else:
            return render(request, "login.html", {"msg": "用户名或密码错误！", "login_form": login_form})


class LogoutView(View):
    """
    用户登出
    """
    def get(self, request):
        logout(request)
        return HttpResponseRedirect(reverse('index'))


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


class UploadImageView(LoginRequiredMixin, View):
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


class UpdatePwdView(LoginRequiredMixin, View):
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
        print(email)
        if models.UserProfile.objects.filter(email=email):
            return HttpResponse('{"email": "邮箱已经存在！"}', content_type='application/json')
        if email:
            send_register_email(email, 'update')
            return HttpResponse('{"status": "success"}',  content_type='application/json')



class UpdateEmailView(LoginRequiredMixin, View):
    def post(self, request):
        update_email = UpdateUserEmailForm(request.POST, instance=request.user)
        if update_email.is_valid():
            email = request.POST.get('email', "")
            code = request.POST.get('code', "")
            print(email,  code)
            if models.EmailVerifyRecord.objects.get(email=email, code=code, send_type='update'):
                update_email.save()
                models.EmailVerifyRecord.objects.filter(email=email).delete()
                return HttpResponse('{"status": "success"}', content_type='application/json')
            else:
                return HttpResponse('{"email": "验证码出错！"}', content_type='application/json')
        else:
            return HttpResponse('{"status": "fail"}', content_type='application/json')


class UserCourseView(LoginRequiredMixin, View):
    def get(self, request):
        all_courses = UserCourse.objects.filter(user=request.user)
        return render(request, 'usercenter-mycourse.html', {
            "all_courses": all_courses
        })


class UserFavView(LoginRequiredMixin, View):
    def get(self, request, type_id):
        if type_id:
            res = UserFavorite.objects.filter(user=request.user, fav_type=int(type_id))
            fav_ids = [ each.fav_id for each in res ]

            if int(type_id) == 2:
                all_favorgs = CourseOrg.objects.filter(id__in=fav_ids)

                return render(request, 'usercenter-fav-org.html', {
                    "all_favorgs": all_favorgs,
                    "type": type_id,
                })
            elif int(type_id) == 1:
                all_favcourses = Course.objects.filter(id__in=fav_ids)
                return render(request, 'usercenter-fav-course.html', {
                    "all_favcourses": all_favcourses,
                    "type": type_id,
                })
            elif int(type_id) == 3:
                all_favteachers = Teacher.objects.filter(id__in=fav_ids)
                return render(request, 'usercenter-fav-teacher.html', {
                    "all_favteachers": all_favteachers,
                    "type": type_id,
                })
            else:
                return HttpResponse('{"status": fail}', content_type='application/json')
        return HttpResponse('{"status": fail}', content_type='application/json')


class UserMessageView(LoginRequiredMixin, View):
    def get(self, request):
        all_messages = UserMessage.objects.filter(user=request.user.id)
        all_unread_messages = UserMessage.objects.filter(has_read=False)
        for unread_message in all_unread_messages:
            unread_message.has_read = True
            unread_message.save()

        try:
            page = request.GET.get('page', 1)
        except PageNotAnInteger:
            page = 1

        p = Paginator(all_messages, 5, request=request)

        messages = p.page(page)

        return render(request, 'usercenter-message.html', {
            "all_messages": messages
        })


class IndexView(View):
    def get(self, request):
        # 取出轮播图
        # print(1/0)  # 配置服务器500错误
        all_banners = models.Banner.objects.all().order_by('index')
        courses = Course.objects.filter(is_banner=False)[:6]
        banner_courses = Course.objects.filter(is_banner=True)[:3]
        course_orgs = CourseOrg.objects.all()[:15]
        return render(request, 'index.html', {
            "all_banners": all_banners,
            "courses": courses,
            "banner_courses": banner_courses,
            "course_orgs": course_orgs
        })


def page_not_found(request):  #固定写法
    from django.shortcuts import render_to_response
    response = render_to_response('404.html', {})
    response.status_code = 404
    return  response

def page_error(request):  #固定写法
    from django.shortcuts import render_to_response
    response = render_to_response('500.html', {})
    response.status_code = 500
    return  response