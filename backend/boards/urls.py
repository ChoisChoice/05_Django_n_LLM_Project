from django.urls import path
from . import views


urlpatterns = [
    path("", views.Boards.as_view(), name="boards"),  # 게시판 접근할 수 있는 url
    path("<int:board_pk>/", views.BoardsDetail.as_view(), name="boards-detail"),  # 게시판의 특정 게시물에 접근할 수 있는 url
    path("<int:board_pk>/comments/", views.Comments.as_view(), name="comments"),  # 특정 게시글과 관련 댓글에 접근할 수 있는 url
    path("<int:board_pk>/comments/<int:comment_pk>/", views.CommentsDetail.as_view(), name="comments-detail"),  # 특정 댓글에 접근할 수 있는 url")
    path("<int:board_pk>/comments/<int:comment_pk>/thumb-up/", views.ThumbUp.as_view(), name="comments-thumb-up"),  # 댓글 추천에 접근할 수 있는 url
]
