from django.shortcuts import render
from django.template import context

# Create your views here.


def login(request):
    context = {"title": "login"}
    return render(request, "users/login.html", context)

def profile(request):
    context = {"title": "profile"}
    return render(request, "users/profile.html", context)


def logout(request): ...


