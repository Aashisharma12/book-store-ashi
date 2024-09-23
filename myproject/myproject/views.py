from django.shortcuts import render,redirect
from django.http import HttpResponse
from django.template import loader
def homepage(request):
    return render(request,"index.html")
def home_view(request):
    return render(request, 'home.html')

 
