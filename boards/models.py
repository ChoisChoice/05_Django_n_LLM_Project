from django.db import models
from common.models import CommonModel

# Create your models here.
class Posting(CommonModel):

    """ 게시물에 사용할 데이터를 정의하는 클래스 """

    class PostingCategoryChoices(models.TextChoices):
        SIGN_IN = ("sign_in", "Related Issue: Sign In")                       # 로그인
        OPINION_OF_USE = ("opinion_of_use", "Related Issue: Opinion of Use")  # 사용후기
        ERROR = ("error", "Related Issue: Some Error")                        # 에러
        IMPROVEMENTS = ("improvements", "Related Issue: Improvements")        # 개선할점
    
    # 게시글 번호 - pk 사용

    # 게시글 유형
    posting_category = models.CharField(
        max_length=20,
        choices=PostingCategoryChoices.choices,
        verbose_name = "Posting Category",
    )

    # 작성자
    writer = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        related_name="postings",
        verbose_name = "Writer",
    )

    # 제목
    title = models.CharField(
        max_length=100,
        blank=False,
        null=False,
        verbose_name = "Title",
    )

    # 비공개여부
    disclosure_status = models.BooleanField(
        default=True, 
        verbose_name = "Disclosure Status",
    )

    # 내용
    content = models.TextField(
        max_length=500,
        blank=False,
        null=False,
        verbose_name = "Content",
    )

    """ 
    [Lesson] blank=False: 폼에서 비워둘 수 없음
    null=False: db에서 비워둘 수 없음
    """

    # 첨부파일
    attachment = models.URLField(
        blank=True,
        verbose_name = "Attachment",
    )

    # 조회수
    hits = models.PositiveIntegerField(
        default=0,
        blank=False,
        null=False,
        verbose_name = "Hits",
    )

    def __str__(self) -> str:
        return self.title


class Comment(CommonModel):

    """ 게시물 댓글 관련 데이터를 정의하는 클래스 """

    # 댓글 번호 - pk 사용

    # 게시글
    posting = models.ForeignKey(
        "boards.Posting",
        on_delete=models.CASCADE,
        verbose_name = "Posting",
    )

    # 작성자
    writer = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        verbose_name = "Writer",
    )

    # 댓글
    comment = models.TextField(
        max_length=200,
        blank=False,
        null=False,
        verbose_name = "Comment",
    )

    # 추천
    thumb_up_status = models.PositiveIntegerField(
        default=0,
        blank=False,
        null=False,
        verbose_name = "Thumb-Up Status",
    )

    def __str__(self) -> str:
        return self.comment