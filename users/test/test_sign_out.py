from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from users.models import User
from common.test.test_user_variable import TestUserVariable

class TestSignOut(TestUserVariable, APITestCase):

    """ SignOut 테스트 클래스 """
    
    # test 변수 설정
    URL = "/api/v1/users/sign-out"

    # 사전 설정
    def setUp(self):
        # 사용자 데이터
        self.user_data = {
            "username":self.USERNAME,
            "password":self.PASSWORD,
        }
        # 사용자 생성
        self.user = User.objects.create_user(**self.user_data)

        # 토큰 생성
        self.token = Token.objects.create(user=self.user)

    # 로그인 후, 로그아웃 잘 되는지 테스트
    def test_sign_out(self):
        # 토큰을 사용하여 인증 설정
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        
        response = self.client.post(
            self.URL,
            data=self.user_data,
        )
        self.assertEqual(response.status_code, 200)

    @classmethod
    def tearDownClass(cls):
        print(f"{cls.__name__} 테스트 완료")