from django.contrib import admin
from .models import Board, Comment

@admin.register(Board)
class BoardAdmin(admin.ModelAdmin):
    fieldsets = (
        (
            "Board", 
            {
                "fields": (
                    "board_category",
                    "writer",
                    "title",
                    "disclosure_status",
                    "content",
                    "attachment",
                ),
                "classes": (
                    "wide",
                ),  # 간격을 넓게 해줌
            },
        ),
    )
        
    list_display = (
        "board_number",
        "board_category",
        "writer",
        "title",
        "disclosure_status",
        "hits",
        "thumb_up_status",
    )

    list_filter = (
        "board_category",
        "disclosure_status",
        "hits",
        "thumb_up_status",
    )

    # exclude = ('hits', 'thumb_up_status')

@admin.register(Comment)
class CommmetAdmin(admin.ModelAdmin):
    list_display = (
        "writer",
        "comment",
        "created_at",
        "updated_at",
    )

    list_filter = (
        "writer",
    )
