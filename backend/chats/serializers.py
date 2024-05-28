from chats.models import Profile, ChatMessage
from rest_framework import serializers

class ProfileSerializer(serializers.ModelSerializer):

    """ 사용자 프로파일 직렬화 클래스 """

    class Meta:
        model = Profile
        fields = ['id', 'user', 'full_name', 'image']
    
    def __init__(self, *args, **kwargs):
        super(ProfileSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        if request and request.method=='POST':
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3


class ChatMessageSerializer(serializers.ModelSerializer):

    """ 채팅 메시지 직렬화 클래스 """

    reciever_profile = ProfileSerializer(read_only=True)
    sender_profile = ProfileSerializer(read_only=True)

    class Meta:
        model = ChatMessage
        fields = ['id', 'sender', 'reciever', 'reciever_profile', 'sender_profile' ,'message', 'is_read', 'date']
    
    def __init__(self, *args, **kwargs):
        super(ChatMessageSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        if request and request.method=='POST':
            self.Meta.depth = 0
        else:
            self.Meta.depth = 2