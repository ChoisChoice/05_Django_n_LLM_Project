from chats.models import ChatMessage
from rest_framework.serializers import ModelSerializer
from users.serializers import ProfileSerializer

class ChatMessageSerializer(ModelSerializer):

    """ 채팅 메시지 직렬화 클래스 """

    reciever_profile = ProfileSerializer(read_only=True)
    sender_profile = ProfileSerializer(read_only=True)

    class Meta:
        model = ChatMessage
        fields = ["id", "user", "sender", "reciever", "reciever_profile", "sender_profile", "message", "is_read", "created_at"]
    
    def __init__(self, *args, **kwargs):
        super(ChatMessageSerializer, self).__init__(*args, **kwargs)
        request = self.context.get("request")
        if request and request.method=="POST":
            self.Meta.depth = 1

