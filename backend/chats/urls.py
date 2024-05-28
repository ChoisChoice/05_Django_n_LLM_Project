from django.urls import path
from . import views

urlpatterns = [
    path("my-messages/<user_id>/", views.MyInbox.as_view()),
    
]