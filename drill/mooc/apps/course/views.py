from django.shortcuts import render, HttpResponse
from django.views.generic.base import View

from pure_pagination import Paginator, EmptyPage, PageNotAnInteger

from course.models import Course
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
        return render(request, 'course-detail.html', {
            'course': course,
        })
