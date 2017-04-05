# _*_ coding: utf-8 _*_

from django.shortcuts import render,HttpResponse
from django.views.generic import View

from pure_pagination import Paginator, EmptyPage, PageNotAnInteger

import models

from .forms import UserAskForm
# Create your views here.


class OrgView(View):
    def get(self, request):
        all_orgs = models.CourseOrg.objects.all()
        hot_orgs = all_orgs.order_by('-click_nums')[:3]

        # 城市
        all_citys = models.CityDict.objects.all()

        # 取出筛选城市
        city_id = request.GET.get('city', "")

        if city_id:
            all_orgs = all_orgs.filter(city_id=int(city_id))

        # 类别筛选
        category = request.GET.get("ct", "")

        if category:
            all_orgs = all_orgs.filter(category=category)

        org_nums = all_orgs.count()

        sort = request.GET.get("sort", "")
        if sort == "students":
            all_orgs = all_orgs.order_by("-students")
        elif sort == "courses":
            all_orgs = all_orgs.order_by("-course_nums")


        # 对课程机构进行分页
        try:
            page = request.GET.get('page', 1)
        except PageNotAnInteger:
            page = 1

        p = Paginator(all_orgs, 5, request=request)

        orgs = p.page(page)
        # print(orgs)
        return render(request, 'org-list.html', {
            "all_orgs": orgs,
            "all_citys": all_citys,
            "org_nums": org_nums,
            "city_id": city_id,
            "category": category,
            "hot_orgs": hot_orgs,
            "sort": sort
        })


    def post(self, request):
        pass


class AddUserAskView(View):
    """
    用户添加咨询
    """
    def post(self, request):
        userask_form = UserAskForm(request.POST)
        if userask_form.is_valid():
            user_ask = userask_form.save(commit=True)
            return HttpResponse("{'status': 'success'}", content_type="application/json")
        else:
            return HttpResponse("{'status': 'fail', 'msg':'添加出错'}", content_type="application/json")