# _*_ coding: utf-8 _*_

from django.shortcuts import render
from django.views.generic import View

from pure_pagination import Paginator, EmptyPage, PageNotAnInteger

import models
# Create your views here.


class OrgView(View):
    def get(self, request):
        all_orgs = models.CourseOrg.objects.all()
        org_nums = all_orgs.count()
        all_citys = models.CityDict.objects.all()
        # 对课程机构进行分页
        try:
            page = request.GET.get('page', 1)
        except PageNotAnInteger:
            page = 1

        p = Paginator(all_orgs, 5, request=request)

        orgs = p.page(page)
        return render(request, 'org-list.html', {
            "all_orgs": orgs,
            "all_citys": all_citys,
            "org_nums": org_nums
        })


    def post(self, request):
        pass