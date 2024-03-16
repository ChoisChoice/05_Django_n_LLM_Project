from rest_framework.serializers import ModelSerializer
from .models import User

class PublicUserSerializer(ModelSerializer):

    """ 보안에 민감한 데이터를 '제외한' user 데이터를 직렬화하는 클래스 """
    
    class Meta:
        model = User
        fields = (
            "username",
            "name",
        )

class PrivateUserSerializer(ModelSerializer):

    """ 보안에 민감한 데이터를 '포함한' user 데이터를 직렬화하는 클래스 """

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