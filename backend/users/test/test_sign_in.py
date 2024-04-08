from django.urls import reverse
from rest_framework.test import APITestCase
from users.models import User
from common.tests import TestUserVariable


class TestSignIn(TestUserVariable, APITestCase):

    """ SignIn 테스트 클래스 """

    # 변수 설정
    tuv = TestUserVariable()
    RIGHT_USERNAME = tuv.USERNAME
    RIGHT_PASSWORD = tuv.PASSWORD
    WRONG_USERNAME = "WrongUsername"
    WRONG_PASSWORD = "1234"
    URL = reverse("sign-in")

    # 사전 설정
    def setUp(self):
        # 올바른 유저 정보
        self.right_user_data = {
            "username":self.RIGHT_USERNAME,
            "password":self.RIGHT_PASSWORD,
        }
        # 잘못된 username 데이터
        self.wrong_username_data = {
            "username":self.WRONG_USERNAME,
            "password":self.RIGHT_PASSWORD,
        }
        # 잘못된 password 데이터
        self.wrong_password_data = {
            "username":self.RIGHT_USERNAME,
            "password":self.WRONG_PASSWORD,
        }
        # 존재하지 않은 유저 데이터
        self.anonymous_data = {
            "username":self.WRONG_USERNAME,
            "password":self.WRONG_PASSWORD,
        }
        # 사용자 생성
        User.objects.create_user(**self.right_user_data)  

    # 올바르게 로그인 할 경우 테스트
    def test_correct_sign_in(self):
        response = self.client.post(
            self.URL,
            data=self.right_user_data,
        )
        self.assertEqual(response.status_code, 200)
        self.assertTrue('access' in response.data['token'])  # 토큰 여부
        self.assertTrue('refresh' in response.data['token'])
        self.assertIn('access', response.cookies)  # 쿠키값 확인
        self.assertIn('refresh', response.cookies)

    # id / password 중 잘못된 정보로 로그인 할 경우 테스트
    def test_incorrect_sign_in(self):
        # 잘못된 username으로 로그인 시도
        response_wud = self.client.post(
            self.URL,
            data=self.wrong_username_data,
        )
        self.assertEqual(response_wud.status_code, 400)
        # 잘못된 password으로 로그인 시도
        response_wpd = self.client.post(
            self.URL,
            data=self.wrong_password_data,
        )
        self.assertEqual(response_wpd.status_code, 400)
    
    # 등록되지 않은 사람이 로그인 할 경우 테스트
    def test_outsider_sign_in(self):
        # 등록되지 않은 username으로 로그인 시도
        response = self.client.post(
            self.URL,
            data=self.anonymous_data,
        )
        self.assertEqual(response.status_code, 400)

    @classmethod
    def tearDownClass(cls):
        print(f"{cls.__name__} 테스트 완료")