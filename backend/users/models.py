from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save

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
        # unique=True,
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

    # USERNAME_FIELD = "email"
    # REQUIRED_FIELDS = ["username"]

    def profile(self):
        profile = Profile.objects.get(user=self)


class Profile(models.Model):

    """ 채팅에 사용할 사용자 프로파일 """

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=1000)
    biography  = models.CharField(max_length=100)
    image = models.ImageField(upload_to="user_images", default="default.jpg")
    verified = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if self.full_name == "" or self.full_name == None:
            self.full_name = self.user.username
        super(Profile, self).save(*args, **kwargs)


def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

post_save.connect(create_user_profile, sender=User)
post_save.connect(save_user_profile, sender=User)
