from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.exceptions import ParseError, NotFound
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from django.contrib.auth import authenticate
from django.conf import settings
from . import serializers
from users.models import User


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
            # 토큰 발급
            token = TokenObtainPairSerializer.get_token(user)
            access_token = str(token.access_token)
            refresh_token = str(token)
            # print(access_token, refresh_token)
            response = Response(
                data=serializer.data, 
                status=status.HTTP_200_OK, 
                headers={"successed": "Sign-up has been successful"},
            )
            # 토큰 쿠키에 저장
            response.set_cookie("access", access_token, httponly=True)
            response.set_cookie("refresh", refresh_token, httponly=True)
            return response
        else:
            return Response(
                data=serializer.errors, 
                status=status.HTTP_400_BAD_REQUEST, 
                headers={"failed":"Sign-up failed."},
            )
        
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
        if user:  # 사용자 확인
            # 토큰 발급
            token = TokenObtainPairSerializer.get_token(user)
            access_token = str(token.access_token)
            refresh_token = str(token)
            # print(access_token, refresh_token)
            response = Response(
                status=status.HTTP_200_OK, 
                headers={"successed":"Log-in has been successful."},
            )
            # 토큰 쿠키에 저장
            response.set_cookie("access", access_token, httponly=True)
            response.set_cookie("refresh", refresh_token, httponly=True)
            return response
        else:
            return Response(
                status=status.HTTP_400_BAD_REQUEST, 
                headers={"failed":"Log-in failed."},
            )

class SignOut(APIView):

    """ 로그아웃하는 클래스 """

    def post(self, request):
        response = Response(
            status=status.HTTP_200_OK, 
            headers={"successed":"Log-out has been successful."},
        )
        # 토큰(쿠키) 삭제
        response.delete_cookie("access")
        response.delete_cookie("refresh")
        return response

class ShowProfile(APIView):

    """ 사용자 프로필을 보여주는 클래스 """

    def get(self, request, username):  # '@username'로 사용자 프로필에 접속하기에 username을 매개변수로 받음
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise NotFound
        serializer = serializers.PrivateUserSerializer(user)
        return Response(
            data=serializer.data,
            status=status.HTTP_200_OK,
            headers={"successed": "Profile has been imported successfully."},
        )

class UpdateProfile(APIView):
    
    """ 비밀번호를 제외한 내 정보를 수정할 수 있는 클래스 """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user  
        serializer = serializers.PrivateUserSerializer(user) 
        return Response(
            data=serializer.data,
            status=status.HTTP_200_OK,
            headers={"successed": "Profile has been imported successfully."},
        ) 

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
            return Response(
                data=serializer.data,
                status=status.HTTP_200_OK,
                headers={"successed": "Profile update successful."},
            )
        else:
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
                headers={"failed": "Profile update failed."},
            )

class UpdatePassword(APIView):

    """ 비밀번호를 변경하는 클래스 """

    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")
        if not old_password or not new_password:  # 비밀번호 입력 받지 못할 경우..
            raise ParseError
        if user.check_password(old_password):  # 옛날 비밀번호가 맞다면..
            user.set_password(new_password)
            user.save()
            return Response(
                status=status.HTTP_200_OK,
                headers={"successed": "Password update successful."},
            )
        else:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                headers={"failed": "Password update failed."},
            )

