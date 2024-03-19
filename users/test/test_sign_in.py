from rest_framework.test import APITestCase
from users.models import User
from common.test.test_user_variable import TestUserVariable


class TestSignIn(TestUserVariable, APITestCase):

    """ SignIn 테스크 클래스 """

    # test할 변수 생성
    tuv = TestUserVariable()
    RIGHT_USERNAME = tuv.USERNAME
    WRONG_USERNAME = "WrongUsername"
    RIGHT_PASSWORD = "abcd"
    WRONG_PASSWORD = "1234"
    ANONYMOUS_USERNAME = "AnonymousUsername"
    ANONYMOUS_PASSWORD = "zxcvasdf"
    URL = "/api/v1/users/sign-in"

    # test db에 설정
    def setUp(self):
        # 사용자 데이터
        self.user_data = {
            "username":self.RIGHT_USERNAME,
            "password":self.RIGHT_PASSWORD,
        }

        # 사용자 생성
        User.objects.create_user(**self.user_data)  

        """ 
        [Lesson] create(): 비밀번호가 그대로 저장 
        create_user(): 비밀번호가 hash 처리되어 저장 -> 그래서 인증시 주로 사용
        """

    # 올바르게 로그인 할 경우 테스트
    def test_correct_sign_in(self):
        response = self.client.post(
            self.URL,
            data=self.user_data,
        )
        self.assertEqual(response.status_code, 200)

    # id / password 중 잘못된 정보로 로그인 할 경우 테스트
    def test_incorrect_sign_in(self):
        # 잘못된 username 데이터
        wrong_username_data = {
            "username":self.WRONG_USERNAME,
            "password":self.RIGHT_PASSWORD,
        }

        # 잘못된 password 데이터
        wrong_password_data = {
            "username":self.RIGHT_USERNAME,
            "password":self.WRONG_PASSWORD,
        }

        # 잘못된 username으로 로그인 시도
        response_wud = self.client.post(
            self.URL,
            data=wrong_username_data,
        )
        self.assertEqual(response_wud.status_code, 400)

        # 잘못된 password으로 로그인 시도
        response_wpd = self.client.post(
            self.URL,
            data=wrong_password_data,
        )
        self.assertEqual(response_wpd.status_code, 400)
    
    # 등록되지 않은 사람이 로그인 할 경우 테스트
    def test_outsider_sign_in(self):
        # 등록되지 않은 username 데이터
        anonymous_data = {
            "username":self.ANONYMOUS_USERNAME,
            "password":self.ANONYMOUS_PASSWORD,
        }

        # 등록되지 않은 username으로 로그인 시도
        response = self.client.post(
            self.URL,
            data=anonymous_data,
        )
        self.assertEqual(response.status_code, 400)

    @classmethod
    def tearDownClass(cls):
        print(f"{cls.__name__} 테스트 완료")