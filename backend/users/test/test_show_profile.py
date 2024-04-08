from django.urls import reverse
from rest_framework.test import APITestCase
import os
from users.models import User
from common.tests import TestUserVariable


class TestShowProfile(TestUserVariable, APITestCase):

    """ ShowProfile 테스트 클래스 """
    
    # 변수 설정
    URL = "http://127.0.0.1:8000/api/v1/users/"

    # 사전 설정
    def setUp(self):
        # 사용자 데이터
        self.user_data = {
            "username": self.USERNAME,
            "password": self.PASSWORD,
        }
        # 사용자 생성
        User.objects.create_user(**self.user_data) 
        # 토큰 생성
        self.token_pair = self.client.post(reverse("sign-in"),data=self.user_data).data["token"]

    # 잘못된 url로 들어갔을 때, 에러가 나는지 테스트
    def test_url_not_found(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token_pair["access"]}')
        error_url = os.path.join(self.URL, "@"+"NotFounded"+"/")
        # print(error_url)
        response = self.client.get(error_url)
        self.assertEqual(response.status_code, 404)
    
    # 올바른 url로 들어갔을 때, 프로필이 잘 보이는지 테스트
    def test_get_profile(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token_pair["access"]}')
        created_url = os.path.join(self.URL, "@"+self.USERNAME+"/")
        response = self.client.get(created_url)
        # print(response.json())
        # 응답 정상 여부 체크
        self.assertEqual(response.status_code, 200)
        # test db에 올바르게 데이터가 입력되었는지 체크
        self.assertEqual(response.json()["username"], self.USERNAME)

    @classmethod
    def tearDownClass(cls):
        print(f"{cls.__name__} 테스트 완료")