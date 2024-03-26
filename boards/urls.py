from django.urls import path
from . import views


urlpatterns = [
    path("", views.Boards.as_view(), name="boards-list"),  # 게시판 접근할 수 있는 url
    path("<int:pk>", views.BoardsDetail.as_view(), name="boards-detail"),  # 게시판의 특정 게시물에 접근할 수 있는 url
    path("comments", views.Comments.as_view(), name="comments-list"),  # 모든 댓글에 접근할 수 있는 url
    path("<int:pk>/comments", views.CommentsDetail.as_view(), name="comments-detail"),  # 특정 게시글과 관련 댓글에 접근할 수 있는 url
]