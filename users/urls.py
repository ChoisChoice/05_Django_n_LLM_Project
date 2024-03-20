from django.urls import path
from . import views

urlpatterns = [
    path("sign-up", views.SignUp.as_view(), name="sign-up"),
    path("sign-in", views.SignIn.as_view(), name="sign-in"),
    path("sign-out", views.SignOut.as_view(), name="sign-out"),
    path("jwt-signin", views.JWTSignIn.as_view(), name="jwt"),
    path("@<str:username>/", views.ShowProfile.as_view(), name="profile"),
    path("update-profile", views.UpdateProfile.as_view(), name="update-profile"),
    path("update-password", views.UpdatePassword.as_view(), name="update-password"),
]

"""
[Question] 왜 ShowProfile을 보여주는 url에 '/'를 붙여야 작동할까?
"""