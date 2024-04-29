from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views


urlpatterns = [
    path("sign-up/", views.SignUp.as_view(), name="sign-up"),
    path("sign-in/", views.SignIn.as_view(), name="sign-in"),
    path("sign-in/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("sign-out/", views.SignOut.as_view(), name="sign-out"),
    path("github/", views.GithubSignIn.as_view(), name="github-sign-in"),
    path("social-sign-out/", views.SocialSignOut.as_view(), name="social-sign-out"),
    path("@<str:username>/", views.ShowProfile.as_view(), name="profile"),
    path("profile/", views.Profile.as_view(), name="profile"),
    path("update-password/", views.UpdatePassword.as_view(), name="update-password"),
]