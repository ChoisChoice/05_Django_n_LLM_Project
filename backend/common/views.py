from django.conf import settings
from rest_framework.exceptions import ValidationError
import re


def pagination(request):

    """ 페이지네이션을 정의하는 함수 """

    try:
        page = request.query_params.get("page", 1)
        page = int(page)
    except ValueError:
        page = 1
    page_size = settings.PAGE_SIZE
    start = (page - 1) * page_size 
    end = start + page_size
    return start, end


def validate_password(password):

    """ 회원가입시, 비밀번호 유효성 검사하는 함수 """
    
    # 비밀번호는 8자 이상
    if len(password) < 8:
        raise ValidationError("Password must be at least 8 characters long.")
    
    # 대/소문자 2개 이상 포함 여부 확인
    if (
        len(re.findall(r'[A-Z]', password)) < 2 or
        len(re.findall(r'[a-z]', password)) < 2
    ):
        raise ValidationError("The password must contain at least two uppercase and lowercase letters.")
    
    # 숫자 2개 이상 포함 여부 확인
    if len(re.findall(r'\d', password)) < 2:
        raise ValidationError("The password must contain at least two numbers.")
    
    # 특수문자 2개 이상 포함 여부 확인
    if len(re.findall(r'[!@#$%^&*()_+{}|:"<>?~`\-=[\];\',./]', password)) < 2:
        raise ValidationError("Your password must contain at least two special characters.")

    return True
