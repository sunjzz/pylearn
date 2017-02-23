from django.shortcuts import render,HttpResponse
import requests
import os



def index(request):
    if request.method == 'POST':
        file_obj = request.FILES.get('file')
        print(file_obj.name)
        f = open(os.path.join('data', file_obj.name), 'wb')
        for chunk in file_obj.chunks():
            f.write(chunk)
        f.close()

        return HttpResponse('OK!')
    return render(request, 'index.html')
