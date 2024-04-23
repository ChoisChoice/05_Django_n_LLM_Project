from django.urls import path
from . import views


urlpatterns = [
    path("document-gpt/", views.SummaryDocumentGPT.as_view(), name="document-gpt"), 
]