from django.urls import path
from . import views


urlpatterns = [
    path("original-news/", views.OriginalNews.as_view(), name="original-news"),
    path("summarized-news/", views.SummarizedNewsGPT.as_view(), name="summarized-news"), 
    path("translated-news/", views.TranslatedNewsGPT.as_view(), name="translated-news"), 
]