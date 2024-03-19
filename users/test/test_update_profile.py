from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
import os
from users.models import User
from common.test.test_user_variable import TestUserVariable


class TestUpdateProfile(TestUserVariable, APITestCase):

    """ UpdateProfile 테스트 클래스 """
    
    # test할 변수 설정
    UPDATED_NAME = "test updated name"
    UPDATED_EMAIL = "testupdatedemail@test.com"
    URL = "/api/v1/users/update-profile"

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
        self.token = Token.objects.create(user=self.user)

        """ 
        [Lesson] views.py에 있는 UpdateProfile 클래스의 경우, permission_classes = [IsAuthenticated]가 설정되어 있기에 token 인증이 필요함 
        """

    # 잘못된 url로 들어갔을 때, 에러가 나는지 테스트
    def test_url_not_found(self):
        error_url = os.path.join(self.URL, "/"+"NotFounded")
        response = self.client.get(error_url)

        self.assertEqual(response.status_code, 404)

    # 올바른 url로 들어갔을 때, 업데이트할 프로필이 잘 보이는지 테스트
    def test_get_profile(self):
        # 토큰을 사용하여 인증 설정
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')  

        response = self.client.get(self.URL)
        data = response.json()

        # 응답 정상 여부 체크
        self.assertEqual(response.status_code, 200)

        # test db에 올바르게 데이터가 입력되었는지 체크
        self.assertEqual(data["username"], self.USERNAME)
        self.assertEqual(data["name"], self.NAME)
        self.assertEqual(data["email"], self.EMAIL)

    # 올바른 url로 들어갔을 때, 프로필 업데이트가 잘되는지 테스트
    def test_put_profile(self):
        # 토큰을 사용하여 인증 설정
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')  
        
        response = self.client.put(
            self.URL,
            data={
                "name":self.UPDATED_NAME,
                "email":self.UPDATED_EMAIL,
            },
        )
        data = response.json()
        
        """ [Lesson] 위 response객체의 data 형식이 맞지 않으면 400에러 발생하기에 주의해야 함 """

        # 응답 정상 여부 체크
        self.assertEqual(response.status_code, 200)

        # 입력된 데이터 일치 여부 체크
        self.assertEqual(data["name"], self.UPDATED_NAME)
        self.assertEqual(data['email'], self.UPDATED_EMAIL)

    @classmethod
    def tearDownClass(cls):
        print(f"{cls.__name__} 테스트 완료")