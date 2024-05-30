from django.db.models import OuterRef, Subquery
from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated
from users.models import User
from chats.models import  ChatMessage
from chats.serializers import ChatMessageSerializer

class MyMessages(APIView):

    """ 채팅 메시지 조회하는 클래스 """
    
    def get(self, request, user_id):
        try:
            user_id = User.objects.get(id=user_id)
            messages = ChatMessage.objects.filter(
                id__in =  Subquery(
                    User.objects.filter(
                        Q(sender__reciever=user_id) |
                        Q(reciever__sender=user_id)
                    ).distinct().annotate(
                        last_msg=Subquery(
                            ChatMessage.objects.filter(
                                Q(sender=OuterRef("id"), reciever=user_id) |
                                Q(reciever=OuterRef("id"), sender=user_id)
                            ).order_by("-id")[:1].values_list("id", flat=True) 
                        )
                    ).values_list("last_msg", flat=True).order_by("-id")
                )
            ).order_by("-id")

        except User.DoesNotExist:
            raise NotFound
        
        serializer = ChatMessageSerializer(messages, many=True)

        return Response(
            data = serializer.data, 
            status=status.HTTP_200_OK,
            headers={"successed":"ChatBox is worked!"}
        )
    
class GetMessages(APIView):

    """ 채팅 메시지 조회하는 클래스 """

    def get(self, request, sender_id, reciever_id):
        messages = ChatMessage.objects.filter(sender__in=[sender_id, reciever_id], reciever__in=[sender_id, reciever_id])
        
        serializer = ChatMessageSerializer(messages, many=True)
        
        return Response(
            data=serializer.data, 
            status=status.HTTP_200_OK,
            headers={"successed":"GetMessages is worked!"}
        )

class SendMessages(APIView):

    """ 채팅 메시지 전송하는 클래스 """

    def post(self, request):
        serializer = ChatMessageSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                data=serializer.data, 
                status=status.HTTP_201_CREATED,
                headers={"successed":"SendMessages is worked!"},
            )
        
        return Response(
            data=serializer.errors, 
            status=status.HTTP_400_BAD_REQUEST,
            headers={"failed":"SendMessages is NOT worked!"},
        )