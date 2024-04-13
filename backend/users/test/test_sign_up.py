from django.urls import reverse
from rest_framework.test import APITestCase
from users.models import User
from common.tests import TestUserVariable


class TestSignUP(TestUserVariable, APITestCase):

    """ SignUp 테스트 클래스 """

    # 사전 설정
    def setUp(self):
        # 올바른 사용자 데이터
        self.right_user_data = {
            "username": self.USERNAME,
            "password": self.PASSWORD,
        }
        # 잘못된 사용자 데이터
        self.wrong_user_data = {
            "username": "",
            "password": self.PASSWORD,
        }

    # 회원가입 잘 안되는지 테스트
    def test_wrong_sign_up(self):
        response = self.client.post(
            reverse("sign-up"),
            data=self.wrong_user_data,
        )
        self.assertEqual(response.status_code, 400)

    # 회원가입 잘 되는지 테스트
    def test_right_sign_up(self):
        response = self.client.post(
            reverse("sign-up"),
            data=self.right_user_data,
        )
        # print(response.data)
        self.assertEqual(response.status_code, 200)

    # 회원가입한 계정으로 로그인, 로그아웃 잘 되는지 테스트
    def test_sign_in_n_sign_out(self):
        # 회원가입
        signup_response = self.client.post(
            reverse("sign-up"),
            data=self.right_user_data,
        )
        self.assertEqual(signup_response.status_code, 200)

        # 로그인
        signin_response = self.client.post(
            reverse("sign-in"),
            data=self.right_user_data,
        )
        # print(signin_response.data["token"]["refresh"])
        self.assertEqual(signin_response.status_code, 200)
        self.assertTrue("access" in signin_response.data["token"])  # 토큰 여부
        self.assertTrue("refresh" in signin_response.data["token"])

        # 로그아웃
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {signin_response.data["token"]["access"]}')  # access token으로 authorization 설정
        signout_response = self.client.post(
            reverse("sign-out"),
            data={"refresh": signin_response.data["token"]["refresh"]},
        )
        self.assertEqual(signout_response.status_code, 205)

    @classmethod
    def tearDownClass(cls):
        print(f"{cls.__name__} 테스트 완료")