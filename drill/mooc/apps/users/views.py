from django.shortcuts import render

# Create your views here.

from django.shortcuts import render
from django.contrib.auth import authenticate, login
from django.contrib.auth.backends import ModelBackend
from django.db.models import Q

import models

class CustomBackend(ModelBackend):
    def authenticate(self, username=None, password=None, **kwargs):
        try:
            user = models.UserProfile.objects.get(Q(username=username)|Q(email=username), Q(password=password))
            if user.check_password(password):
                return user
        except Exception as e:
            return None




def user_login(request):
    if request.method == 'POST':
        user_name = request.POST.get("username", "")
        pass_word = request.POST.get("password", "")
        user = authenticate(usernmae = user_name, password = pass_word)
        if user is not None:
            login(request, user)
            render(request, "index.html")
    if request.method =='GET':
        return render(request, 'login.html', {})