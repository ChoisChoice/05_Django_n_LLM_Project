from rest_framework.test import APITestCase
from users.models import User
from common.tests import TestUserVariable


class TestUpdatePassword(TestUserVariable, APITestCase):

    """ UpdatePassword 테스트 클래스 """
    
    # test할 변수 설정
    tuv = TestUserVariable()
    OLD_PASSWORD = tuv.PASSWORD
    NEW_PASSWORD = "abcd"
    URL = "/api/v1/users/update-password"

    # 사전 설정
    def setUp(self):
        # 사용자 데이터
        self.user_data = {
            "username":self.USERNAME,
            "password":self.OLD_PASSWORD,
        }

        # 사용자 생성
        self.user = User.objects.create_user(**self.user_data)

        """ 
        [Lesson] IsAuthenticated는 인증된 사용자가 권한에 접근할 수 있도록 제한을 둔 것
        하지만 이 코드에서는 login한 사용자로 간주(login())되기 때문에 인증문제가 발생하지 않기에 Token이 필요없음
        [Question] force_login()과 login()의 차이점은 무엇일까?
        """
        
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
        
        # 응답 정상 여부 체크
        self.assertEqual(response.status_code, 200)
        
        # 변경된 비밀번호로 로그인 가능한지 체크
        self.client.logout()  # 기존 로그인 세션 종료 후..
        login_success = self.client.login(username=self.USERNAME, password=self.NEW_PASSWORD)
        self.assertTrue(login_success)
    
    @classmethod
    def tearDownClass(cls):
        print(f"{cls.__name__} 테스트 완료")