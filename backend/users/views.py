import requests
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.exceptions import ParseError, NotFound, ValidationError
from rest_framework.permissions import IsAuthenticated, AllowAny 
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, login, logout
from django.conf import settings
from . import serializers
from users.models import User
from common.views import validate_password


class SignUp(APIView):

    """ 회원가입하는 클래스 """

    permission_classes = [AllowAny,]

    def post(self, request):
        password = request.data.get("password")  # 사용자로부터 비밀번호를 입력받음
        if not password:
            raise ParseError
        # 비밀번호 유효성 검증
        try:
            validate_password(password)
        except ValidationError as e:
            return Response(
                data={"password": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
                headers={"failed": "Sign-up failed."},
            )
        serializer = serializers.PrivateUserSerializer(data=request.data)  # 사용자로부터 입력받은 정보 기반 직렬화
        if serializer.is_valid():
            user = serializer.save()  # 사용자 정보 저장
            user.set_password(password)  # 사용자 비밀번호 설정
            user.save()  # 설정한 비밀번호와 함께 사용자 정보 저장
            serializer = serializers.PrivateUserSerializer(user)
            return Response(
                data=serializer.data, 
                status=status.HTTP_200_OK, 
                headers={"successed": "Sign-up has been successful"},
            )
        else:
            return Response(
                data=serializer.errors, 
                status=status.HTTP_400_BAD_REQUEST, 
                headers={"failed": "Sign-up failed."},
            )
        
class SignIn(APIView):

    """ simple-jwt로 로그인하는 클래스 """

    permission_classes = [AllowAny,]
    
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
            # print(token)
            access_token = str(token.access_token)
            refresh_token = str(token)
            response = Response(
                {
                    "token": {
                        "access": access_token,
                        "refresh": refresh_token,
                    },
                },
                status=status.HTTP_200_OK, 
                headers={"successed": "Log-in has been successful."},
            )
            # 토큰 쿠키에 저장
            response.set_cookie("access", access_token, httponly=True)
            response.set_cookie("refresh", refresh_token, httponly=True)
            return response
        else:
            return Response(
                status=status.HTTP_400_BAD_REQUEST, 
                headers={"failed": "Log-in failed."},
            )

class SignOut(APIView):

    """ simple-jwt로 로그아웃하는 클래스 """

    permission_classes = [IsAuthenticated,]

    def post(self, request):
        try:
            refresh_token = RefreshToken(request.data["refresh"])
            # print(refresh_token)
            refresh_token.blacklist()  # 만료된 토큰을 블랙리스트에 추가
            response = Response(
                status=status.HTTP_205_RESET_CONTENT, 
                headers={"successed": "Sign-out has been successful."},
            )
            # 토큰(쿠키) 삭제
            response.delete_cookie("access")
            response.delete_cookie("refresh")
            return response
        except Exception as e:
            return Response(
                status=status.HTTP_400_BAD_REQUEST, 
                headers={"successed": "Sign-out has been trouble."},
            )

class GithubSignIn(APIView):

    """ github로 로그인 하는 클래스 """

    def post(self, request):
        try:
            # 토큰 발급
            code = request.data.get("code")
            access_token = requests.post(
                url=f"https://github.com/login/oauth/access_token?code={code}&client_id=164eb89a9f21d451ebaa&client_secret={settings.GH_SECRET}",
                headers={"Accept": "application/json"},
            )
            access_token = access_token.json().get("access_token")
            # 사용자 데이터 가져오기
            user_data = requests.get(
                url="https://api.github.com/user",
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Accept": "application/json",
                },
            )
            user_data = user_data.json()
            # 사용자 이메일 가져오기
            user_emails = requests.get(
                url="https://api.github.com/user/emails",
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Accept": "application/json",
                },
            )
            user_emails = user_emails.json()
            # 로그인 시도
            try:
                user = User.objects.get(email=user_emails[0]["email"])
                login(request, user)
                return Response(status=status.HTTP_200_OK)
            except User.DoesNotExist:
                user = User.objects.create(
                    username=user_data.get("login"),
                    email=user_emails[0]["email"],
                    name=user_data.get("name"),
                )
                user.set_unusable_password()
                user.save()
                login(request, user)
                return Response(status=status.HTTP_200_OK)
        except Exception:
                return Response(status=status.HTTP_400_BAD_REQUEST)

class KakaoSignIn(APIView):

    """ kakao로 로그인 하는 클래스 """

    def post(self, request):
        try:
            # 토큰 발급
            code = request.data.get("code")
            print(code)
            access_token = requests.post(
                url="https://kauth.kakao.com/oauth/token",
                headers={"Content-type": "application/x-www-form-urlencoded;charset=utf-8"},
                data={
                    "grant_type": "authorization_code",
                    "client_id": "63d64636075adcc88581d17290cb5928",
                    "redirect_uri": "http://127/0/0/1:3000/social/kakao",
                    "code": code,
                },
            )
            print(access_token.json())
            access_token = access_token.json().get("access_token")
            # 사용자 데이터 가져오기
            user_data = requests.get(
                url="https://kapi.kakao.com/v2/user/me",
                headers={
                    "Authorization": f"Bearer ${access_token}",
                    "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
                },
            )
            # print(user_data.json())
            user_data = user_data.json()
            kakao_account = user_data.get("kakao_account")
            profile = kakao_account.get("profile")
            try:
                user = User.objects.get(email=kakao_account.get("email"))
                login(request, user)
                return Response(status=status.HTTP_200_OK)
            except User.DoesNotExist:
                user = User.objects.create(
                    email=kakao_account.get("email"),
                    username=profile.get("nickname"),
                    name=profile.get("nickname"),
                )
                user.set_unusable_password()
                user.save()
                login(request, user)
                return Response(status=status.HTTP_200_OK)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class SocialSignOut(APIView):

    """ 소셜 로그인한 계정을 로그아웃하는 클래스 """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            logout(request)
            return Response(
                status=status.HTTP_205_RESET_CONTENT,
                headers={"successed": "Sign-out has been successful!"},
            )
        except Exception as e:
            return Response(
                status=status.HTTP_400_BAD_REQUEST, 
                headers={"successed": "Sign-out has been trouble."},
            )

class ShowProfile(APIView):

    """ 사용자 프로필을 보여주는 클래스 """

    permission_classes = [IsAuthenticated,]

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

class Profile(APIView):
    
    """ 비밀번호를 제외한 내 정보를 조회 및 수정할 수 있는 클래스 """

    permission_classes = [IsAuthenticated,]

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

    permission_classes = [IsAuthenticated,]

    def put(self, request):
        user = request.user
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")
        if not old_password or not new_password:  # 비밀번호 입력 받지 못할 경우..
            raise ParseError
        # 비밀번호 유효성 검사
        try:
            validate_password(new_password)
        except ValidationError as e:
            return Response(
                data={"password": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
                headers={"failed": "Sign-up failed."},
            )
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

