from rest_framework.test import APITestCase
from django.urls import reverse
from users.models import User
from common.test.test_user_variable import TestUserVariable


class TestSignUP(TestUserVariable, APITestCase):

    """ SignUp 테스트 클래스 """
    
    # test 변수 생성
    URL = "/api/v1/users/sign-up"

    # 사전 설정
    def setUp(self):
        # 올바른 사용자 데이터
        self.right_user_data = {
            "username":self.USERNAME,
            "password":self.PASSWORD,
            "gender":self.GENDER,
            "nationality":self.NATIONALITY,
            "language":self.LANGUAGE,
        }
        
        # 잘못된 사용자 데이터
        self.wrong_user_data = {
            "username":self.USERNAME,
            "password":self.PASSWORD,
            "gender":self.GENDER,
        }

    # 회원가입 잘 안되는지 테스트
    def test_wrong_sign_up(self):
        response = self.client.post(
            self.URL,
            data=self.wrong_user_data,
        )
        self.assertEqual(response.status_code, 400)

    # 회원가입 잘 되는지 테스트
    def test_sign_up(self):
        response = self.client.post(
            self.URL,
            data=self.right_user_data,
        )
        self.assertEqual(response.status_code, 200)

    # 회원가입한 계정으로 로그인, 로그아웃 잘 되는지 테스트
    def test_sign_in_n_sign_out(self):
        # 회원가입 체크
        signup_response = self.client.post(
            self.URL,
            data=self.right_user_data,
        )
        self.assertEqual(signup_response.status_code, 200)

        # 로그인 및 세션 체크
        login_response = self.client.post(
            reverse('sign-in'),
            data=self.right_user_data,
        )
        self.assertEqual(login_response.status_code, 200)

        check_id_in_session = self.client.session.get('_auth_user_id')  # 세션에 사용자가 있는지 확인
        # print(check_id_in_session)
        self.assertTrue(check_id_in_session)

        # 로그아웃 및 세션 체크
        self.client.logout()
        check_id_in_session = self.client.session.get('_auth_user_id')
        self.assertFalse(check_id_in_session)

    @classmethod
    def tearDownClass(cls):
        print(f"{cls.__name__} 테스트 완료")