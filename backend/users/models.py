from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):

    """ 유저 데이터에 대한 필드 및 유형을 결정하는 클래스 """

    class GenderChoices(models.TextChoices):
        MALE = ("male", "Male")
        FEMALE = ("female", "Female")
    
    class NationalityChoices(models.TextChoices):
        DOMESTIC = ("domestic", "Domestic")
        FOREIGN = ("foreign", "Foreign")

    class LanguageChoices(models.TextChoices):
        KR = ("kr", "Korean")
        EN = ("en", "English")

    # (서양식) 이름 
    first_name = models.CharField(
        max_length=150,
        editable=False,  # 관리자 페이지에 나타나지 않음
    )
    
    # (서양식) 성
    last_name = models.CharField(
        max_length=150,
        editable=False,
    )

    # (동양식) 성명
    name = models.CharField(
        max_length=150,
        default="",
        verbose_name = "Name",
    )

    # 이메일
    email = models.EmailField(
        blank=True,
        verbose_name = "Email",
    )

    # 주소
    address = models.CharField(
        max_length=200,
        blank=True,
        verbose_name = "Address",
    )

    # 휴대폰 번호
    phone_number = models.CharField(
        max_length=20,
        blank=True,
        verbose_name = "Phone Number",
    )

    # 성별
    gender = models.CharField(
        max_length=10,
        choices=GenderChoices.choices,
        blank=True,
        verbose_name = "Gender",
    )

    # 내·외국인
    nationality = models.CharField(
        max_length=10,
        choices=NationalityChoices.choices,
        blank=True,
        verbose_name = "Nationality",
    )

    # 언어 선택
    language = models.CharField(
        max_length=10,
        choices=LanguageChoices.choices,
        blank=True,
        verbose_name = "Language",
    )

    # 가입 날짜: AbstractUser에 date_joined를 사용해도 됨
    created_at = models.DateField(
        blank=True, 
        null=True,
        auto_now_add=True,
        editable=False,
        verbose_name = "Created Date",
    )

    class Meta:
        verbose_name = "User Information"
        verbose_name_plural = "Users"

    """
    [Question] id, password, email은 해당 필드에 포함시켜야 할까? 
    => username이 보통 id로 사용되고 AbstractUser에 정의되어 있음, email 또한 AbstractUser에 정의되어 있어 해당 클래스에 자동으로 상속받게 됨 
    => password는 AbstractBaseUser에 정의되어 있고 AbstractUser에 AbstractBaseUser가 상속되어 있어 해당 클래스에 자동으로 상속받게 됨(AbstractBaseUser-AbstractUser-User)
    [Question] 인증을 위해 사용될 유저 휴대폰번호, 통신사는 해당 필드에 포함시켜야 할까? 아니면 인증을 위해 다른 곳에 정의를 해야할까?
    ==> 일단 models.py에 정의
    [Lesson] address, phone_num와 같이 상속받은 클래스에 정의되어 있지 않은 필드를 포함시켜 User 클래스를 재정의하였음으로 settings.py에 가서 AUTH_USER_MODEL = 'users.User'를 등록해야 함
    """