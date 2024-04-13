from django.urls import reverse
from rest_framework.test import APITestCase
from users.models import User
from boards.models import Posting, Comment
from common.tests import TestUserVariable, TestBoardVariable, TestCommentVariable


class TestComments(TestUserVariable, TestBoardVariable, TestCommentVariable, APITestCase):

    """ Comments 테스트 클래스 """

    # 사전 설정
    def setUp(self):
        # 사용자 데이터
        self.user_data_1 = {
            "username": self.USERNAME+"1",
            "password": self.PASSWORD+"1",
        }
        self.user_data_2 = {
            "username": self.USERNAME+"2",
            "password": self.PASSWORD+"2",
        }
        # 사용자 생성
        self.user_1 = User.objects.create_user(**self.user_data_1) 
        self.user_2 = User.objects.create_user(**self.user_data_2) 
        # 공개 게시글 데이터
        self.undisclosure_data = {
            "posting_category": self.POSTING_CATEGORY,
            "title": self.TITLE,
            "writer": self.user_1,
            "disclosure_status": self.DISCLOSURE_STATUS,  # False
            "content": self.CONTENT,
        }
        # 비공개 게시글 데이터
        self.disclosure_data = {
            "posting_category": self.POSTING_CATEGORY,
            "title": self.TITLE,
            "writer": self.user_2,
            "disclosure_status": True,
            "content": self.CONTENT,
        }
        # 공개 게시글 생성
        self.ud_posting = Posting.objects.create(**self.undisclosure_data)
        # 비공개 게시글 생성
        self.d_posting = Posting.objects.create(**self.disclosure_data)
        # 토큰 생성
        self.token_pair = self.client.post(reverse("sign-in"), data=self.user_data_1).data["token"]
        # access 토큰 등록
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token_pair["access"]}')

    # 댓글 가져오기 테스트
    def test_get_comment_in_undisclosure_board(self):
        comment_data = {
            "posting": self.ud_posting,
            "writer": self.user_1,
            "comment": self.COMMENT,
            "thumb_up": self.THUMB_UP,
            }
        thumb_up = comment_data.pop("thumb_up", None)  # thumb_up = ManyToMany
        comment = Comment.objects.create(**comment_data)
        if thumb_up:
            comment.thumb_up.set(thumb_up)
        response = self.client.get(
            reverse("comments", kwargs={"board_pk": self.ud_posting.pk}),
        )
        self.assertEqual(response.status_code, 200)

    # 댓글 작성 테스트
    def test_post_comment_in_undisclosure_board(self):
        # 댓글 데이터
        comment_data = {
            "posting": self.ud_posting,
            "writer": self.user_1,
            "comment": self.COMMENT,
            "thumb_up": self.THUMB_UP,
            }
        response = self.client.post(
            reverse("comments", kwargs={"board_pk": self.ud_posting.pk}),
            data={**comment_data},
        )
        self.assertEqual(response.status_code, 201)

    # 다른 사람의 비공개 게시판에 접근후, 댓글 작성 테스트
    def test_post_comment_in_disclosure_board(self):
        comment_data = {
            "posting": self.d_posting,
            "writer": self.user_1,
            "comment": self.COMMENT,
            "thumb_up": self.THUMB_UP,
        }
        response = self.client.post(
            reverse("comments", kwargs={"board_pk": self.d_posting.pk}),
            data={**comment_data},
        )
        self.assertEqual(response.status_code, 401)

    @classmethod
    def tearDownClass(cls):
        print(f"{cls.__name__} 테스트 완료")
