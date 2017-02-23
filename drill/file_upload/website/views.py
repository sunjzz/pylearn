from django.shortcuts import render
import os

# Create your views here.

def index(request):
    if request.method == 'POST':
        file = request.FILES.get('file')
        f = open(os.path.join('data', file.name), 'wb')
        for chunk in file.chunks():
            f.write(chunk)
        f.close()
    return render(request, 'index.html')
