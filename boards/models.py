from django.db import models
from common.models import CommonModel

# Create your models here.
class Board(CommonModel):

    """ 게시판에 사용할 데이터를 정의하는 클래스 """

    class BoardCategoryChoices(models.TextChoices):
        SIGN_IN = ("sign_in", "SignIn")                       # 로그인
        OPINION_OF_USE = ("opinion_of_use", "Opinion of Use") # 사용후기
        ERROR = ("error", "Error")                            # 에러
        IMPROVEMENTS = ("improvements", "Improvements")       # 개선할점
    
    # 게시글 번호
    board_number = models.AutoField(
        primary_key=True, 
        unique=True, 
    )

    # 게시글 유형
    board_category = models.CharField(
        max_length=20,
        choices=BoardCategoryChoices.choices,
    )

    # 작성자
    writer = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        related_name="boards",
    )

    # 제목
    title = models.CharField(
        max_length=100,
        blank=False,
        null=False,
    )

    # 비공개여부
    disclosure_status = models.BooleanField(
        default=True, 
    )

    # 내용
    content = models.TextField(
        max_length=500,
        blank=False,
        null=False,
    )

    """ 
    [Lesson] blank=False: 폼에서 비워둘 수 없음
    null=False: db에서 비워둘 수 없음
    """

    # 첨부파일
    attachment = models.URLField(
        blank=True,
    )

    # 조회수
    hits = models.PositiveIntegerField(
        default=0,
    )

    # 추천
    thumb_up_status = models.PositiveIntegerField(
        default=0,
    )


class Comment(CommonModel):

    """ 게시판 댓글 관련 데이터를 정의하는 클래스 """

    # 작성자
    writer = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        related_name = "comments",
    )

    # 댓글
    comment = models.TextField(
        max_length=200,
        blank=False,
        null=False,
    )
