from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):

    class GenderChoices(models.TextChoices):
        MALE = ("male", "Male")
        FEMALE = ("female", "Female")
    
    class NationalityChoices(models.TextChoices):
        DOMESTIC = ("domestic", "Domestic")
        FOREIGN = ("foreign", "Foreign")

    class LanguageChoices(models.TextChoices):
        KR = ("kr", "Korean")
        EN = ("en", "English")

    # 유저명
    username = models.CharField(
        max_length=150,
        default=False,
    )

    # First Name
    first_name = models.CharField(
        max_length=150,
        editable=False,
    )
    
    # Last Name
    last_name = models.CharField(
        max_length=150,
        editable=False
    )

    # 이메일
    email = models.EmailField(
        blank=True,
    )

    # 성별
    gender = models.CharField(
        max_length=10,
        choices=GenderChoices.choices,
    )

    # 내, 외국인
    nationality = models.CharField(
        max_length=10,
        choices=NationalityChoices.choices,
    )

    # 언어 선택
    language = models.CharField(
        max_length=10,
        choices=LanguageChoices.choices,
    )

    """
    id, password, email은 해당 필드에 포함시켜야 할까? 
    => username이 보통 id로 사용, email은 AbstractUser에 정의되어 있어 해당 클래스는 자동으로 상속받게 됨 
    => password는 AbstractBaseUser에 정의되어 있고 AbstractUser에 AbstractBaseUser가 상속되어 있어 해당 클래스에 자동으로 상속받게 됨(AbstractBaseUser-AbstractUser-User)
    인증을 위해 사용될 유저 휴대폰번호, 통신사는 해당 필드에 포함시켜야 할까?
    아니면 인증을 위해 다른 곳에 정의를 해야할까?
    """