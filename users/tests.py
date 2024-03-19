from rest_framework.test import APITestCase
import json
import os
from . import models

class TestUserVariable:

    """ test db에 저장될 변수 클래스 """

    USERNAME = "UsernameTest"
    NAME = "Mr.Test"
    EMAIL = "test@test.com"
    ADDRESS = "P.O Box Test Area"
    GENDER = "male"
    NATIONALITY = "domestic"
    LANGUAGE = "kr"

class TestShowProfile(TestUserVariable, APITestCase):

    """ ShowProfile 테스트 클래스 """
    
    # test할 변수 설정
    URL = "/api/v1/users/"

    # test db 생성
    def setUp(self):
        models.User.objects.create(
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

class TestUpdateProfile(TestUserVariable, APITestCase):

    """ UpdateProfile 테스트 클래스 """
    
    # test할 변수 설정
    UPDATED_NAME = "test updated name"
    UPDATED_EMAIL = "testupdatedemail@test.com"
    URL = "/api/v1/users/update-profile"

    # test db 생성
    def setUp(self):
        self.user = models.User.objects.create(
            username=self.USERNAME,
            name=self.NAME,
            email=self.EMAIL,
            address=self.ADDRESS,
            gender=self.GENDER,
            nationality=self.NATIONALITY,
            language=self.LANGUAGE,
        )
        self.client.force_authenticate(user=self.user)  # 권한 부여

    # 잘못된 url로 들어갔을 때, 에러가 나는지 테스트
    def test_url_not_found(self):
        error_url = os.path.join(self.URL, "/"+"NotFounded")
        response = self.client.get(error_url)

        self.assertEqual(response.status_code, 404)

    # 올바른 url로 들어갔을 때, 업데이트할 프로필이 잘 보이는지 테스트
    def test_get_profile(self):
        response = self.client.get(self.URL)
        # print(response)
        data = response.json()
        # print(data)

        # 응답 정상 여부 체크
        self.assertEqual(response.status_code, 200)

        # test db에 올바르게 데이터가 입력되었는지 체크
        self.assertEqual(data["username"], self.USERNAME)
        self.assertEqual(data["name"], self.NAME)
        self.assertEqual(data["address"], self.ADDRESS)
        self.assertEqual(data["language"], self.LANGUAGE)

    # 올바른 url로 들어갔을 때, 프로필 업데이트가 잘되는지 테스트
    def test_put_profile(self):
        response = self.client.put(
            self.URL,
            data={
                "name":self.UPDATED_NAME,
                "email":self.UPDATED_EMAIL,
            },
        )
        # print(response)

        """ [Lesson] 위 response객체의 data 형식이 맞지 않으면 400에러 발생하기에 주의해야 함 """

        data = response.json()
        # print(data)

        # 응답 정상 여부 체크
        self.assertEqual(response.status_code, 200)

        # 입력된 데이터 일치 여부 체크
        self.assertEqual(data["name"], self.UPDATED_NAME)
        self.assertEqual(data['email'], self.UPDATED_EMAIL)

class TestUpdatePassword(TestUserVariable, APITestCase):

    """ UpdatePassword 테스트 클래스 """
    
    # test할 변수 설정
    OLD_PASSWORD = "1234"
    NEW_PASSWORD = "qlalfqjsgh"
    URL = "/api/v1/users/update-password"

    # test db 생성
    def setUp(self):
        self.user = models.User.objects.create(
            username=self.USERNAME,
            password=self.OLD_PASSWORD,
            name=self.NAME,
            email=self.EMAIL,
            address=self.ADDRESS,
            gender=self.GENDER,
            nationality=self.NATIONALITY,
            language=self.LANGUAGE,
        )
        # self.user.set_password(self.OLD_PASSWORD)
        # self.user.save()
        self.client.force_authenticate(user=self.user)  # 권한 부여
    
    # 잘못된 url로 들어갔을 때, 에러가 나는지 테스트
    def test_url_not_found(self):
        error_url = os.path.join(self.URL, "/"+"NotFounded")
        response = self.client.get(error_url)
        self.assertEqual(response.status_code, 404)

    def test_put_password(self):
        # response = self.client.put(
        #     self.URL,
        #     data=json.dumps(
        #         {
        #             "old_password":self.OLD_PASSWORD,
        #             "new_password":self.NEW_PASSWORD,
        #         }
        #     ),  # json.dumps: obj --(직렬화)-> json
        #     content_type='application/json',
        # )
        
        # print(response)
        data = response.json()
        # print(type(data))
        # print(len(data))
        print(data)

        # 입력된 데이터 일치 여부 체크
        # self.assertEqual(data[0]["old_password"], self.OLD_PASSWORD)
        # self.assertEqual(data[0]['new_password'], self.NEW_PASSWORD)