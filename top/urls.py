from django.contrib import admin
from django.urls import path, include

from top import views 

app_name = 'top'

urlpatterns = [
    path('', views.top, name='leaderboard'),
]