from django.db import models

class CommonModel(models.Model):

    """ 공통된 모델 기능을 정의한 클래스 """

    created_at = models.DateTimeField(
        auto_now_add=True,  # 처음 생성할 때, 날짜 업데이트
    ) 
    updated_at = models.DateTimeField(
        auto_now=True,  # 저장할 때, 날짜 업데이트
    )

    class Meta:
        abstract = True
