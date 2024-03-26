from django.urls import path
from . import views


urlpatterns = [
    path("", views.Board.as_view()),  # 게시판 보여주는 url
    path("<int:pk>", views.BoardDetail.as_view()),  # 게시판의 특정 게시물을 보여주는 url
]