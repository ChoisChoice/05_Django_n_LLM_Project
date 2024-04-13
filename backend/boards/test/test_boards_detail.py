from django.urls import reverse
from rest_framework.test import APITestCase
from users.models import User
from boards.models import Posting
from common.tests import TestUserVariable, TestBoardVariable


class TestBoardsDetail(TestUserVariable, TestBoardVariable, APITestCase):

    """ BoardsDetail 테스트 클래스 """

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

    # 공개 게시글이 잘 보이는지 테스트
    def test_get_n_put_n_delete_undisclosure_board(self):
        # get
        response = self.client.get(
            reverse("boards-detail", kwargs={"board_pk": self.ud_posting.pk}),
        )
        self.assertEqual(response.status_code, 200)
        # put
        response = self.client.put(
            reverse("boards-detail", kwargs={"board_pk": self.ud_posting.pk}),
            data={"content": "change the content."},
        )
        self.assertEqual(response.status_code, 200)
        # delete
        response = self.client.delete(
            reverse("boards-detail", kwargs={"board_pk": self.ud_posting.pk}),
        )
        self.assertEqual(response.status_code, 204)

    # 비공개 게시글이 보이는지 테스트
    def est_get_n_put_n_delete_disclosure_board(self):
        ## 비공개 게시글을 작성하지 않은 유저 - 안 보여야 함
        # get
        response = self.client.get(
            reverse("boards-detail", kwargs={"board_pk": self.d_posting.pk}),
        )
        self.assertEqual(response.status_code, 401)
        # put
        response = self.client.put(
            reverse("boards-detail", kwargs={"board_pk": self.d_posting.pk}),
            data={"content": "change the content."},
        )
        self.assertEqual(response.status_code, 403)
        # delete
        response = self.client.delete(
            reverse("boards-detail", kwargs={"board_pk": self.d_posting.pk}),
        )
        self.assertEqual(response.status_code, 403)
        ## 비공개 게시글을 작성한 유저 - 보여야 함
        # 토큰 생성 및 등록
        self.token_pair = self.client.post(reverse("sign-in"), data=self.user_data_2).data["token"]
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token_pair["access"]}')
        response = self.client.get(
            reverse("boards-detail", kwargs={"board_pk": self.d_posting.pk}),
        )
        # get
        self.assertEqual(response.status_code, 200)

    @classmethod
    def tearDownClass(cls):
        print(f"{cls.__name__} 테스트 완료")