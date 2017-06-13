# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render, HttpResponse

# Create your views here.

from django.views.generic.base import View

from forms import ContactForm

from models import Publisher, Author, Book


class SearchBookView(View):
    def get(self, request):
        return render(request, 'search_form.html',
                      {'error': False})

    def post(self, request):
        if 'q' in request.POST and request.POST['q']:
            q = request.POST['q']
            books = Book.objects.filter(title__icontains=q)
            return render(request, 'search_results.html',
                          {'books': books, 'query': q})
        else:
            return render(request, 'search_form.html',
                          {'error': True})
            # return HttpResponse('Please submit a search term.')


def search(request):
    if 'book_name' in request.GET and request.GET['book_name']:
        book_name = request.GET['book_name']
        books = Book.objects.filter(title__icontains=book_name)
        return render(request, 'search_results.html',
                      {'books': books, 'query': book_name})
    else:
        return HttpResponse('Please submit a search term.')
