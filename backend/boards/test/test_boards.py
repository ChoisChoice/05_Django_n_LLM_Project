from django.urls import reverse
from rest_framework.test import APITestCase
from users.models import User
from boards.models import Posting
from common.tests import TestUserVariable, TestBoardVariable


class TestBoards(TestUserVariable, TestBoardVariable, APITestCase):

    """ Boards 테스트 클래스 """

    # 변수 설정
    URL = reverse("boards")
    
    # 사전 설정
    def setUp(self):
        # 사용자 데이터
        self.user_data = {
            "username": self.USERNAME,
            "password": self.PASSWORD,
        }
        # 사용자 생성
        self.user = User.objects.create_user(**self.user_data) 
        # 올바른 게시글 데이터
        self.right_board_data = {
            "posting_category": self.POSTING_CATEGORY,
            "title": self.TITLE,
            "writer": self.user,
            "disclosure_status": self.DISCLOSURE_STATUS,  # False
            "content": self.CONTENT,
        }
        # 잘못된 게시글 데이터 - posting category를 선택 안함
        self.wrong_board_data = {
            "posting_category": "",
            "title": self.TITLE,
            "writer": self.user,
            "disclosure_status": self.DISCLOSURE_STATUS,
            "content": self.CONTENT,
        }
        # 토큰 생성
        self.token_pair = self.client.post(reverse("sign-in"), data=self.user_data).data["token"]
        # access 토큰 등록
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token_pair["access"]}')

    # 게시판이 잘 출력되는지 테스트
    def test_get_boards(self):
        Posting.objects.create(**self.right_board_data)
        response = self.client.get(self.URL)
        self.assertEqual(response.status_code, 200)

    # 게시판이 잘 생성되는지 테스트
    def test_post_board_with_right_data(self):
        response = self.client.post(
            self.URL,
            data=self.right_board_data,
        )
        self.assertEqual(response.status_code, 201)
    
    # 잘못된 데이터로 게시판을 생성하였을 때 에러가 나는지 테스트
    def test_post_board_with_wrong_data(self):
        response = self.client.post(
            self.URL,
            data=self.wrong_board_data,
        )
        self.assertEqual(response.status_code, 400)

    @classmethod
    def tearDownClass(cls):
        print(f"{cls.__name__} 테스트 완료")