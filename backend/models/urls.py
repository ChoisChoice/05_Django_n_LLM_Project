from django.urls import path
from . import views


urlpatterns = [
    path("document-gpt/", views.DocumentGPT.as_view(), name="document-gpt"), 
]