from rest_framework.test import APITestCase
import os
from users.models import User
from common.test.test_user_variable import TestUserVariable

class TestUpdatePassword(TestUserVariable, APITestCase):

    """ UpdatePassword 테스트 클래스 """
    
    # test할 변수 설정
    OLD_PASSWORD = "1234"
    NEW_PASSWORD = "abcd"
    URL = "/api/v1/users/update-password"

    # test db 생성
    def setUp(self):
        self.user = User.objects.create_user(
            username=self.USERNAME,
            password=self.OLD_PASSWORD,
        )
        self.client.force_login(self.user)  # 로그인 상태로 아래 테스트 진행
    
    # 잘못된 url로 들어갔을 때, 에러가 나는지 테스트
    def test_url_not_found(self):
        error_url = os.path.join(self.URL, "/"+"NotFounded")
        response = self.client.get(error_url)
        self.assertEqual(response.status_code, 404)

    # 비밀번호를 넣었을 때, 상태 테스트
    def test_put_password(self):
        # 로그인 상태 확인
        self.assertTrue(self.client.login(username=self.USERNAME, password=self.OLD_PASSWORD))
        
        response = self.client.put(
            self.URL,
            data=
                {
                    "old_password":self.OLD_PASSWORD,
                    "new_password":self.NEW_PASSWORD,
                },
            
        )
        # print(response)
        
        # 응답 정상 여부 체크
        self.assertEqual(response.status_code, 200)
        
        # 변경된 비밀번호로 로그인 가능한지 체크
        self.client.logout()  # 기존 로그인 세션 종료 후..
        login_success = self.client.login(username=self.USERNAME, password=self.NEW_PASSWORD)
        self.assertTrue(login_success)
    
    @classmethod
    def tearDownClass(cls):
        print(f"{cls.__name__} 테스트 완료")