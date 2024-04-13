from django.urls import reverse
from rest_framework.test import APITestCase
from users.models import User
from boards.models import Posting, Comment
from common.tests import TestUserVariable, TestBoardVariable, TestCommentVariable


class TestThumbUp(TestUserVariable, TestBoardVariable, TestCommentVariable, APITestCase):

    """ ThumbUp 테스트 클래스 """

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
        # 댓글 데이터
        self.comment_ud_posting = {
            "posting": self.ud_posting,
            "writer": self.user_1,
            "comment": self.COMMENT,
            "thumb_up": self.THUMB_UP,
            }
        self.comment_d_posting = {
            "posting": self.d_posting,
            "writer": self.user_2,
            "comment": self.COMMENT,
            "thumb_up": self.THUMB_UP,
            }
        # 댓글 생성
        self.ud_thumb_up = self.comment_ud_posting.pop("thumb_up", None)
        self.ud_comment = Comment.objects.create(**self.comment_ud_posting)
        self.d_thumb_up = self.comment_d_posting.pop("thumb_up", None)
        self.d_comment = Comment.objects.create(**self.comment_d_posting)
        # 토큰 생성
        self.token_pair = self.client.post(reverse("sign-in"), data=self.user_data_1).data["token"]
        # access 토큰 등록
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token_pair["access"]}')

    # 공개게시판의 댓글 추천 및 추천 취소하기
    def test_post_n_delete_thumb_up_in_undisclosure(self):
        response = self.client.post(
            reverse(
                "comments-thumb-up", 
                kwargs={
                    "board_pk": self.ud_posting.pk, 
                    "comment_pk": self.ud_comment.pk
                    }
                ),
            )
        self.assertEqual(response.status_code, 200)
        response = self.client.delete(
            reverse(
                "comments-thumb-up",
                kwargs={
                        "board_pk": self.ud_posting.pk, 
                        "comment_pk": self.ud_comment.pk,
                    },
                ),
            )
        self.assertEqual(response.status_code, 200)

    # 비공개게시판의 댓글 추천 및 추천 취소하기
    def test_post_n_delete_thumb_up_in_disclosure(self):
        response = self.client.post(
            reverse(
                "comments-thumb-up", 
                kwargs={
                    "board_pk": self.d_posting.pk, 
                    "comment_pk": self.d_comment.pk
                    }
                ),
            )
        self.assertEqual(response.status_code, 401)
        response = self.client.delete(
            reverse(
                "comments-thumb-up",
                kwargs={
                        "board_pk": self.d_posting.pk, 
                        "comment_pk": self.d_comment.pk,
                    },
                ),
            )
        self.assertEqual(response.status_code, 401)

    @classmethod
    def tearDownClass(cls):
        print(f"{cls.__name__} 테스트 완료")