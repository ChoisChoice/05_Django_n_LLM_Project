from django.urls import reverse
from rest_framework.test import APITestCase
from users.models import User
from common.tests import TestUserVariable

class TestSignOut(TestUserVariable, APITestCase):

    """ SignOut 테스트 클래스 """
    
    # 변수 설정
    tuv = TestUserVariable()
    USERNAME=tuv.USERNAME
    PASSWORD=tuv.PASSWORD
    SIGN_IN_URL = reverse("sign-in")
    SIGN_OUT_URL = reverse("sign-out")

    # 사전 설정
    def setUp(self):
        # 사용자 데이터
        self.user_data = {
            "username":self.USERNAME,
            "password":self.PASSWORD,
        }
        # 사용자 생성
        User.objects.create_user(**self.user_data)
        # 토큰 생성
        self.token_pair = self.get_token_pair()

    # 로그인 후, 토큰 얻기
    def get_token_pair(self):
        response = self.client.post(
            self.SIGN_IN_URL, 
            data=self.user_data, 
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        return response.data['token']

    # 로그아웃 성공한 경우 테스트
    def test_successful_sign_out(self):
        # access token으로 authorization 설정 = 로그인 중
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token_pair["access"]}')
        response = self.client.post(
            self.SIGN_OUT_URL,
            data = {"refresh": self.token_pair["refresh"]},
            format="json",
        )
        self.assertEqual(response.status_code, 205)
        self.assertIn("successed", response.headers)

    # 만료된 토큰으로 로그아웃 실패한 경우 테스트
    def test_failed_sign_out(self):
        # access token으로 authorization 설정 = 로그인 중
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token_pair["access"]}')
        spoiled_token = "spoiled token"
        response = self.client.post(
            self.SIGN_OUT_URL,
            data={"refresh": spoiled_token},
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    # 로그아웃 후에 쿠키가 삭제되었는지 확인 테스트
    def test_cookies_deleted(self):
        # access token으로 authorization 설정 = 로그인 중
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token_pair["access"]}')
        response = self.client.post(
            self.SIGN_OUT_URL,
            data={"refresh": self.token_pair["refresh"]},
            format="json",
        )
        # print(response.cookies)
        # print(type(response.cookies))
        cookies = response.cookies
        self.assertEqual(cookies['access'].value, "")
        self.assertEqual(cookies['refresh'].value, "")

    @classmethod
    def tearDownClass(cls):
        print(f"{cls.__name__} 테스트 완료")