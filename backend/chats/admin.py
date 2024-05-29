from django.contrib import admin
from users.models import User
from chats.models import Profile, ChatMessage

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_editable = ['verified']
    list_display = ['user', 'full_name', 'verified'] 

@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_editable = ['is_read', 'message']
    list_display = ['user', 'sender', 'reciever', 'is_read', 'message']
