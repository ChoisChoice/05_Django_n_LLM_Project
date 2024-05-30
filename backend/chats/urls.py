from django.urls import path
from . import views

urlpatterns = [
    path("my-messages/<int:user_id>/", views.MyMessages.as_view()),
    path("get-messages/<int:sender_id>/<int:reciever_id>/", views.GetMessages.as_view()),
    path("send-messages/", views.SendMessages.as_view()),
]