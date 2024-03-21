from django.contrib import admin
from .models import Posting, Comment

@admin.register(Posting)
class BoardAdmin(admin.ModelAdmin):
    fieldsets = (
        (
            "Board", 
            {
                "fields": (
                    "posting_category",
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
        "posting_number",
        "posting_category",
        "writer",
        "title",
        "disclosure_status",
        "hits",
        "thumb_up_status",
        "created_at",
    )

    list_filter = (
        "posting_category",
        "disclosure_status",
        "hits",
        "thumb_up_status",
    )

    search_fields = (
        "posting_category", 
        "writer", 
        "title",
    )

@admin.register(Comment)
class CommmetAdmin(admin.ModelAdmin):
    list_display = (
        "posting",
        "writer",
        "comment",
        "created_at",
        "updated_at",
    )

    list_filter = (
        "posting",
        "writer",
    )

    search_fields = (
        "posting_category", 
        "writer", 
        "title",
    )
