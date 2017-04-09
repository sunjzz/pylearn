# _*_ encoding: utf-8 _*_
from datetime import datetime

from django.db import models

from organization.models import CourseOrg, Teacher
# Create your models here.


choice_degree = (
    ("cj", "初级"),
    ("zj", "中级"),
    ("gj", "高级"),
)


class Course(models.Model):
    course_org = models.ForeignKey(CourseOrg, verbose_name=u"课程机构", null=True, blank=True)
    name = models.CharField(max_length=50, verbose_name=u"课程名称")
    desc = models.CharField(max_length=300, verbose_name=u"课程描述")
    detail = models.TextField(verbose_name=u"课程详情")
    teacher = models.ForeignKey(Teacher, verbose_name=u"讲师", null=True, blank=True)
    degree = models.CharField(choices=choice_degree, max_length=3, verbose_name=u"课程难度")
    learn_time = models.IntegerField(default=0, verbose_name=u"学习时长（分钟数）")
    students = models.IntegerField(default=0, verbose_name=u"学习人数")
    fav_nums = models.IntegerField(default=0, verbose_name=u"收藏人数")
    image = models.ImageField(upload_to="course/%Y/%m", verbose_name=u"封面图", max_length=100)
    click_nums = models.IntegerField(default=0, verbose_name=u"点击数")
    category = models.CharField(max_length=20, verbose_name=u"课程类别", default='')
    tag = models.CharField(max_length=50, verbose_name=u'课程标签', default='')
    you_need_know = models.CharField(max_length=300, verbose_name=u"课程须知", default="")
    teacher_tell = models.CharField(max_length=300, verbose_name=u"老师告诉你能学到什么", default="")
    add_time = models.DateTimeField(default=datetime.now, verbose_name=u"添加时间")

    class Meta:
        verbose_name = u"课程表"
        verbose_name_plural = verbose_name

    def __unicode__(self):
        return self.name

    def get_lesson_nums(self):
        '''
        获取这门课程的章节数
        :return: 
        '''
        return self.lesson_set.all().count()

    def get_student(self):
        '''
        学习这门课程的用户有哪些
        ps: 该方法可以在前端调用，前端可以调用不带参数的方法
        :return: 
        '''
        return self.usercourse_set.all()[:5]


    def get_course_lesson(self):
        return self.lesson_set.all()



class Lesson(models.Model):
    course = models.ForeignKey(Course, verbose_name=u"课程")
    name = models.CharField(max_length=100, verbose_name=u"章节名")
    add_time = models.DateTimeField(default=datetime.now, verbose_name=u"添加时间")

    class Meta:
        verbose_name = u"章节"
        verbose_name_plural = verbose_name

    def __unicode__(self):
        return self.name

    def get_course_video(self):
        return self.video_set.all()


class Video(models.Model):
    lesson = models.ForeignKey(Lesson, verbose_name=u"视频")
    name = models.CharField(max_length=100, verbose_name=u"视频名")
    learn_time = models.IntegerField(default=0, verbose_name=u"学习时长（分钟数）")
    url = models.CharField(max_length=200, verbose_name=u"访问地址", default="")
    add_time = models.DateTimeField(default=datetime.now, verbose_name=u"添加时间")

    class Meta:
        verbose_name = u"视频"
        verbose_name_plural = verbose_name

    def __unicode__(self):
        return self.name




class CourseResource(models.Model):
    course = models.ForeignKey(Course, verbose_name=u"课程")
    name = models.CharField(max_length=100, verbose_name=u"名称")
    download = models.FileField(upload_to="course/resource/%Y/%m", verbose_name=u"资源", max_length=100)
    add_time = models.DateTimeField(default=datetime.now, verbose_name=u"添加时间")

    class Meta:
        verbose_name = u"课程资源"
        verbose_name_plural = verbose_name

    def __unicode__(self):
        return self.name





# Create your models here.
