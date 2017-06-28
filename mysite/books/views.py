# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render, HttpResponse

# Create your views here.

from django.views.generic.base import View

from forms import ContactForm

from django.views.generic import DetailView, ListView

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


# class PublisherDetail(DetailView):
#     context_object_name = 'publisher'
#     queryset = Publisher.objects.all()
#
#
class BookList(ListView):
    context_object_name = 'book_list'
    queryset = Book.objects.order_by('-publication_date')
    template_name = 'book_list.html'


class AcmeBookList(ListView):
    context_object_name = 'book_list'
    queryset = Book.objects.filter(publisher__name='人民邮电出版社')
    template_name = 'acme_list.html'


class AuthorDetailView(DetailView):
    queryset = Author.objects.all()

    def get_object(self, queryset):
        object = super(DetailView, self).get_object()