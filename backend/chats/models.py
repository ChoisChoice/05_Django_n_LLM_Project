from django.db import models
from common.models import CommonModel
from users.models import Profile

class ChatMessage(CommonModel):

    """ 채팅 메시지 """

    user = models.ForeignKey(
        "users.User",
        on_delete=models.SET_NULL,
        null=True,
        related_name="user",
    )
    sender = models.ForeignKey(
        "users.User",
        on_delete=models.SET_NULL,
        null=True,
        related_name="sender",
    )
    reciever = models.ForeignKey(
        "users.User",
        on_delete=models.SET_NULL,
        null=True,
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