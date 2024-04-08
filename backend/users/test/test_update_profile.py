from django.urls import reverse
from rest_framework.test import APITestCase
import os
from users.models import User
from common.tests import TestUserVariable


class TestUpdateProfile(TestUserVariable, APITestCase):

    """ UpdateProfile 테스트 클래스 """
    
    # test할 변수 설정
    UPDATED_NAME = "test updated name"
    UPDATED_EMAIL = "testupdatedemail@test.com"
    URL = reverse("update-profile")

    # 사전 설정
    def setUp(self):
        # 사용자 데이터
        self.user_data = {
            "username":self.USERNAME,
            "password":self.PASSWORD,
            "name":self.NAME,
            "email":self.EMAIL,
        }
        # 사용자 생성
        self.user = User.objects.create_user(**self.user_data)
        # 토큰 생성
        self.token_pair = self.client.post(reverse("sign-in"),data=self.user_data).data["token"]

    # 잘못된 url로 들어갔을 때, 에러가 나는지 테스트
    def test_url_not_found(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token_pair["access"]}')
        error_url = os.path.join(self.URL, "/"+"NotFounded")
        response = self.client.get(error_url)
        self.assertEqual(response.status_code, 404)

    # 올바른 url로 들어갔을 때, 업데이트할 프로필이 잘 보이는지 테스트
    def test_get_profile(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token_pair["access"]}') 
        response = self.client.get(self.URL)
        data = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["username"], self.USERNAME)
        self.assertEqual(data["name"], self.NAME)
        self.assertEqual(data["email"], self.EMAIL)

    # 올바른 url로 들어갔을 때, 프로필 업데이트가 잘되는지 테스트
    def test_put_profile(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token_pair["access"]}') 
        response = self.client.put(
            self.URL,
            data={
                "name":self.UPDATED_NAME,
                "email":self.UPDATED_EMAIL,
            },
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["name"], self.UPDATED_NAME)
        self.assertEqual(response.json()['email'], self.UPDATED_EMAIL)

    @classmethod
    def tearDownClass(cls):
        print(f"{cls.__name__} 테스트 완료")