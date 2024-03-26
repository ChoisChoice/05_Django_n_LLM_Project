from rest_framework.serializers import ModelSerializer
from .models import Posting, Comment
from users.serializers import PublicUserSerializer

class BoardListSerializer(ModelSerializer):

    """ 게시판(게시글 리스트)을 보여주기 위한 직렬화 클래스 """

    writer = PublicUserSerializer()  # writer는 숫자가 아닌, PublicUserSerializer에 정의한 필드가 보여짐 

    class Meta:
        model = Posting
        fields = (
            "pk",
            "posting_category",
            "writer",
            "title",
            "created_at",
            "updated_at",
        )

    # 조회수 개수
    def get_hits_count(self):
        pass

    # 추천 개수
    def get_thumb_up_status_count(self):
        pass
    
    # 댓글 개수
    def get_comment_count(self):
        pass
    

class BoardDetailSerializer(ModelSerializer):

    """ 게시판에서 특정 게시글을 위한 직렬화 클래스 """

    writer = PublicUserSerializer(read_only=True)  # read_only=True면 owner에 대한 정보를 요구하지 않는다.

    class Meta:
        model = Posting
        fields = fields = "__all__"

    def create(self, validated_data):
        # print(validated_data)
        return Posting.objects.create(**validated_data)  # owner를 포함한 모든 validated_data를 가지고 방을 생성해준다.

class CommentSerializer(ModelSerializer):

    """ 댓글을 위한 직렬화 클래스 """

    class Meta:
        model = Comment
        fields = '__all__'