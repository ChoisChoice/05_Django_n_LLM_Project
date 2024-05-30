from rest_framework.serializers import ModelSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User, Profile


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

class ProfileSerializer(ModelSerializer):

    """ 사용자 프로파일 직렬화 클래스 """

    class Meta:
        model = Profile
        fields = ["id", "user", "full_name", "image"]
    
    def __init__(self, *args, **kwargs):
        super(ProfileSerializer, self).__init__(*args, **kwargs)
        request = self.context.get("request")
        if request and request.method=="POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3