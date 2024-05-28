from django.db import models
from django.db.models.signals import post_save
from common.models import CommonModel
from users.models import User

class Profile(models.Model):

    """ 사용자 프로파일 """

    user = models.OneToOneField("users.User", on_delete=models.CASCADE)
    full_name = models.CharField(max_length=1000)
    bio = models.CharField(max_length=100)
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


class ChatMessage(CommonModel):

    """ 채팅 메시지 """

    user = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        related_name="user",
    )
    sender = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        related_name="sender",
    )
    reciever = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        related_name="reciever",
    )
    message = models.CharField(max_length=1000000)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ["created_at"]
        verbose_name_plural = "Messages"

    def __str__(self):
        return f"{self.sender} - {self.reciever}"
    
    @property
    def sender_profile(self):
        sender_profile = Profile.objects.get(user=self.sender)
        return sender_profile
    
    @property
    def reciever_profile(self):
        reciever_profile = Profile.objects.get(user=self.reciever)
        return reciever_profile