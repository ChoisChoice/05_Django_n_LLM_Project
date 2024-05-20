from django.urls import path
from . import views


urlpatterns = [
    path("summary-news/", views.SummaryNewsGPT.as_view(), name="document-gpt"), 
]