from django.urls import path
from . import views

urlpatterns = [
    path("sign-up", views.SignUp.as_view()),
    path("sign-in", views.SignIn.as_view()),
    path("sign-out", views.SignOut.as_view()),
    path("jwt-signin", views.JWTSignIn.as_view()),
    path("@<str:username>/", views.ShowProfile.as_view()),
    path("update-profile", views.UpdateProfile.as_view()),
    path("update-password", views.UpdatePassword.as_view()),
]

"""
[Question] 왜 ShowProfile을 보여주는 url에 '/'를 붙여야 작동할까?
"""