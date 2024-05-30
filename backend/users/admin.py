from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

# Register your models here.
@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = (
        (
            "Profile", 
            {
                "fields": (
                    "username", 
                    "password", 
                    "email", 
                    "name",
                    "address",
                    "phone_number",
                    "gender",
                    "nationality",
                    "language",
                ),
                "classes": (
                    "wide",
                ),  # 간격을 넓게 해줌
            },
        ),
        ("Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
                "classes": (
                    "collapse",
                ),  # 감추는 기능
            },
        ),
        ("Important dates", 
            {
                "fields": (
                    "last_login", 
                    "date_joined",
                ),
                "classes": (
                    "collapse",
                ),
            },
        ),
    )

    # 화면에 보여줄 데이터
    list_display = (
        "username", 
        "id",
        "email", 
        "name", 
        "gender", 
        "nationality", 
        "is_active", 
        "created_at",
    )

    # 데이터 필터링 기준
    list_filter = (
        "is_active",
        "created_at",
    )

    # 해당 데이터 기준 검색창에서 찾기
    search_fields = (
        "username", 
        "email", 
        "name",
    )