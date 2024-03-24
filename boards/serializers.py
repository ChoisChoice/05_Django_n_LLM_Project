from rest_framework.serializers import ModelSerializer
from .models import Posting, Comment

class PostingListSerializer(ModelSerializer):

    """ 게시판(게시글 리스트)을 보여주기 위한 직렬화 클래스 """

    class Meta:
        model = Posting
        fields = (
            "posting_number",
            "posting_category",
            "writer"
            "title"
            "created_at"
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
    

class PostingSerializer(ModelSerializer):

    """ 게시판에서 특정 게시글을 수정을 위한 직렬화 클래스 """

    class Meta:
        model = Posting
        fields = '__all__'

class CommentSerializer(ModelSerializer):

    """ 댓글을 위한 직렬화 클래스 """

    class Meta:
        model = Comment
        fields = '__all__'