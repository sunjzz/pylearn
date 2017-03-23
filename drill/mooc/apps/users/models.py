# _*_ encoding:utf-8 _*_

from datetime import datetime

from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

choice_gender = (
    ("male", "男"),
    ("female", "女"),
)


class UserProfile(AbstractUser):
    nick_name = models.CharField(max_length=50, verbose_name=u"昵称", default=u"")
    brithday = models.DateField(verbose_name=u"生日", null=True, blank=True)
    gender = models.CharField(max_length=6, verbose_name=u"性别", choices=choice_gender, default="male")
    address = models.CharField(max_length=100, verbose_name=u"地址", default=u"")
    mobile = models.CharField(max_length=11, null=True, blank=True)
    image = models.ImageField(upload_to="image/%Y/%m", default=u"image/default.png", max_length=100)

    class Meta:
        verbose_name = u"用户信息"
        verbose_name_plural = verbose_name

    def __unicode__(self):
        return self.username


choice_send_type = (
    ("register", "注册"),
    ("forget", "找回密码"),
)

class EmailVerifyRecord(models.Model):
    code = models.CharField(max_length=20, verbose_name=u"验证码")
    email = models.EmailField(max_length=50, verbose_name=u"邮箱")
    send_type = models.CharField(choices=choice_send_type, max_length=10)
    send_time = models.DateField(default=datetime.now) #实例化时间
#   send_time = models.DateField(default=datetime.now()) 注意这种写法时间是models编译时间

    class Meta:
        verbose_name = u"邮箱验证码"
        verbose_name_plural = verbose_name


class Banner(models.Model):
    title = models.CharField(max_length=100, verbose_name=u"标题")
    image = models.ImageField(upload_to="banner/%Y/%m", verbose_name=u"轮播图", max_length=100)
    url = models.URLField(max_length=200, verbose_name=u"访问地址")
    index = models.IntegerField(default=100, verbose_name=u"顺序")
    add_time = models.DateTimeField(default=datetime.now, verbose_name=u"添加时间")

    class Meta:
        verbose_name = u"轮播图"
        verbose_name_plural = verbose_name