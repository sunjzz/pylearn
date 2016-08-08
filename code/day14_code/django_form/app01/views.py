from django.shortcuts import render,HttpResponse

# Create your views here.

def index(request):
    print(type(request))
    from django.core.handlers.wsgi import WSGIRequest
    print(request.POST)
    print(request.GET)
    # if request.method == "POST":
    #     upload_file_obj = request._get_files().get('fafafa')
    #     iter_file_data = upload_file_obj.chunks()
    #     f = open(upload_file_obj.name, 'wb')
    #     # 将大文件分块，每次 64k
    #     for d in iter_file_data:
    #         f.write(d)
    #     f.close()
    return HttpResponse('OK')
