from django.shortcuts import render, HttpResponse
from django.views.generic.base import View

from pure_pagination import Paginator, EmptyPage, PageNotAnInteger

from course.models import Course
from operation.models import UserFavorite
# Create your views here.


class CourseListView(View):
    def get(self, request):
        sort = request.GET.get("sort", "")

        if sort == 'hot':
            order_field = "-click_nums"
        elif sort == 'students':
            order_field = "-students"
        else:
            order_field = "-add_time"

        all_courses = Course.objects.all()
        hot_courses = all_courses.order_by("-click_nums")
        choose_course = all_courses.order_by(order_field)

        try:
            page = request.GET.get("page", 1)
        except PageNotAnInteger:
            page = 1

        p = Paginator(choose_course, 3, request=request)

        courses = p.page(page)

        return render(request, 'course-list.html', {
            "all_courses": courses,
            "hot_courses": hot_courses[:3],
            "sort": sort
        })


class CourseDetailView(View):
    def get(self, request, course_id):
        course = Course.objects.get(id = int(course_id))
        course.click_nums += 1
        course.save()

        tag = course.tag
        if tag:
            relate_courses = Course.objects.filter(tag=tag)[:1]
        else:
            relate_courses = []

        has_fav_course = False
        has_fav_org = False

        if request.user.is_authenticated():
            if UserFavorite.objects.filter(user=request.user, fav_id=course.id, fav_type=1):
                has_fav_course = True

            if UserFavorite.objects.filter(user=request.user, fav_id=course.course_org.id, fav_type=2):
                has_fav_org = True
        print(relate_courses)
        return render(request, 'course-detail.html', {
            'course': course,
            'relate_courses': relate_courses,
            'has_fav_course': has_fav_course,
            'has_fav_org': has_fav_org
        })


