from rest_framework.serializers import ModelSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    """ simple-jwt """

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        token['username'] = user.username
        token['email'] = user.email

        return token
    
class PublicUserSerializer(ModelSerializer):

    """ 사용자임을 확인할 수 있는 username(id) 데이터를 직렬화하는 클래스 """
    
    class Meta:
        model = User
        fields = (
            "username",
            "name",
        )

class PrivateUserSerializer(ModelSerializer):

    """ 보안에 민감한 데이터를 제외한 user 데이터를 직렬화하는 클래스 """

    class Meta:
        model = User
        exclude = (
            "password",
            "is_superuser",
            "is_staff", 
            "is_active",
            "groups",
            "user_permissions",
            "created_at",
        )

