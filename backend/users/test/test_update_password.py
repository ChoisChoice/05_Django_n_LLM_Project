from django.urls import reverse
from rest_framework.test import APITestCase
from users.models import User
from common.tests import TestUserVariable


class TestUpdatePassword(TestUserVariable, APITestCase):

    """ UpdatePassword 테스트 클래스 """
    
    # 변수 설정
    NEW_PASSWORD = "AbC2eD4!fg@"  # 새로운 비밀번호
    URL = reverse("update-password")

    # 사전 설정
    def setUp(self):
        # 사용자 데이터
        self.user_data = {
            "username":self.USERNAME,
            "password":self.PASSWORD,  # 옛날 비밀번호
        }
        # 사용자 생성
        self.user = User.objects.create_user(**self.user_data)
        # 토큰 생성
        self.token_pair = self.client.post(reverse("sign-in"),data=self.user_data).data["token"]
        
    # 비밀번호를 넣었을 때, 상태 테스트
    def test_put_password(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token_pair["access"]}')
        # 로그인 상태 확인
        self.assertTrue(self.client.login(username=self.USERNAME, password=self.PASSWORD))
        # 비밀번호 변경
        response = self.client.put(
            self.URL,
            data=
                {
                    "old_password":self.PASSWORD,
                    "new_password":self.NEW_PASSWORD,
                },
            
        )
        # print(response.data)
        self.assertEqual(response.status_code, 200)
        # 기존 로그인 세션 종료
        self.client.logout()  
        # 새로운 비밀번호로 로그인
        self.assertTrue(self.client.login(username=self.USERNAME, password=self.NEW_PASSWORD))
    
    @classmethod
    def tearDownClass(cls):
        print(f"{cls.__name__} 테스트 완료")