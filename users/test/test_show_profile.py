from rest_framework.test import APITestCase
import os
from users.models import User
from common.test.test_user_variable import TestUserVariable


class TestShowProfile(TestUserVariable, APITestCase):

    """ ShowProfile 테스트 클래스 """
    
    # test할 변수 설정
    URL = "/api/v1/users/"

    # 사전 설정
    def setUp(self):
        User.objects.create(
            username=self.USERNAME,
            name=self.NAME,
            email=self.EMAIL,
            address=self.ADDRESS,
            gender=self.GENDER,
            nationality=self.NATIONALITY,
            language=self.LANGUAGE,
        )

    # 잘못된 url로 들어갔을 때, 에러가 나는지 테스트
    def test_url_not_found(self):
        error_url = os.path.join(self.URL, "@"+"NotFounded"+"/")
        # print(error_url)
        response = self.client.get(error_url)
        self.assertEqual(response.status_code, 404)
    
    # 올바른 url로 들어갔을 때, 프로필이 잘 보이는지 테스트
    def test_get_profile(self):
        # print(os.path.join(self.URL, "@"+self.USERNAME+"/"))
        created_url = os.path.join(self.URL, "@"+self.USERNAME+"/")
        response = self.client.get(created_url)
        # print(response)
        data = response.json()
        # print(data)

        # 응답 정상 여부 체크
        self.assertEqual(response.status_code, 200)

        # test db에 올바르게 데이터가 입력되었는지 체크
        self.assertEqual(data["username"], self.USERNAME)
        self.assertEqual(data["name"], self.NAME)

    @classmethod
    def tearDownClass(cls):
        print(f"{cls.__name__} 테스트 완료")