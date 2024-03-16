from django.contrib.auth import authenticate, login, logout
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.exceptions import ParseError, NotFound
from rest_framework.permissions import IsAuthenticated
from . import serializers
from users.models import User

# Create your views here.
class SignUp(APIView):

    """ 회원가입하는 클래스 """

    def post(self, request):
        password = request.data.get("password")  # 사용자로부터 비밀번호를 입력받음
        if not password:
            raise ParseError
        """ 비밀번호 길이 및 요구사항을 validate하는 코드 삽입 """
        serializer = serializers.PrivateUserSerializer(data=request.data)  # 사용자로부터 입력받은 정보 기반 직렬화
        if serializer.is_valid():
            user = serializer.save()  # 사용자 정보 저장
            user.set_password(password)  # 사용자 비밀번호 설정
            user.save()  # 설정한 비밀번호와 함께 사용자 정보 저장
            serializer = serializers.PrivateUserSerializer(user)
            return Response(serializer.data)
        else:
            return Response(serializer.errors)
        
class SignIn(APIView):

    """ 로그인하는 클래스 """
    
    def post(self, request):
        username = request.data.get("username")  # 사용자 id
        password = request.data.get("password")  # 사용자 password
        if not username or not password:
            raise ParseError
        user = authenticate(
            request, 
            username=username,
            password=password,
        )  # 입력받은 사용자 id / password로 인증 시도
        if user:  # 사용자가 맞다면...
            login(request, user)  # 로그인 처리
            return Response({"successed":"Login has been successful."})
        else:
            return Response({"failed":"Login failed."})

class SignOut(APIView):

    """ 로그아웃하는 클래스 """

    permission_classes = [IsAuthenticated]  # 인증된 사용자(로그인한 사용자)만 로그아웃할 수 있도록 권한을 설정

    def post(self, request):
        logout(request)  # 로그아웃
        return Response({"successed":"Logout has been successful."})

class ShowProfile(APIView):

    """ 사용자 프로파일을 보여주는 클래스 """

    def get(self, request, username):  # '@username'로 사용자 프로파일에 접속하기에 username을 매개변수로 받음
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise NotFound
        serializer = serializers.PrivateUserSerializer(user)
        return Response(serializer.data)

class UpdateProfile(APIView):
    
    """ 비밀번호를 제외한 내 정보를 수정할 수 있는 클래스 """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user  
        serializer = serializers.PrivateUserSerializer(user) 
        return Response(serializer.data) 

    def put(self, request):
        user = request.user
        serializer = serializers.PrivateUserSerializer(
            user,
            data=request.data,
            partial=True,  # 부분적인 업데이트 가능여부
        )
        if serializer.is_valid():
            user = serializer.save() 
            serializer = serializers.PrivateUserSerializer(user)
            return Response(serializer.data)
        else:
            return Response(serializer.errors)

class UpdatePassword(APIView):

    """ 비밀번호를 변경하는 클래스 """

    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")
        if not old_password or not new_password:
            raise ParseError
        if user.check_password(old_password):
            user.set_password(new_password)
            user.save()
            return Response(status=status.HTTP_200_OK)
        else:
            raise ParseError




    
    