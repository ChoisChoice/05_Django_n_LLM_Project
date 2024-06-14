from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from .models import Posting, Comment
from users.serializers import PublicUserSerializer


class BoardsSerializer(ModelSerializer):

    """ 게시판(게시글 리스트)을 보여주기 위한 직렬화 클래스 """

    writer = PublicUserSerializer()  # writer 필드를 직렬화(username, name)
    comment_count = serializers.SerializerMethodField()

    class Meta:
        model = Posting
        fields = (
            "pk",
            "posting_category",
            "writer",
            "title",
            "disclosure_status",
            "created_at",
            "comment_count",
            "hits"
        )
    
    # 댓글 개수
    def get_comment_count(self, obj):
        return obj.comment_posting.count()
    

class BoardsDetailSerializer(ModelSerializer):

    """ 게시판에서 특정 게시글을 위한 직렬화 클래스 """

    writer = PublicUserSerializer(read_only=True)  # read_only=True면 writer에 대한 정보를 요구하지 않는다.

    class Meta:
        model = Posting
        fields = "__all__"

    def create(self, validated_data):
        return Posting.objects.create(**validated_data)  # writer를 포함한 모든 validated_data를 가지고 방을 생성해준다.


class CommentsSerializer(ModelSerializer):

    """ 댓글을 위한 직렬화 클래스 """

    writer = PublicUserSerializer(read_only=True)
    posting = BoardsSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = "__all__"
        read_only_fields = ("Posting",)  # 읽기 전용(반드시 tuple로 해야 에러 발생 안함)

    def create(self, validated_data):
        thumb_up = validated_data.pop("thumb_up", None)  # "thumb_up" = ManyToManyField
        comment = Comment.objects.create(**validated_data)
        if thumb_up:
            comment.thumb_up.set(thumb_up)
        return comment
    

class CommentsThumbUpSerializer(ModelSerializer):

    """ 댓글을 추천하기 위한 직렬화 클래스 """

    thumb_up_count = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ("thumb_up", "thumb_up_count",)
        read_only_fields = ("thumb_up", "thumb_up_count",)  # 읽기 전용

    def get_thumb_up_count(self, obj):
        return obj.thumb_up.count()