from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views


urlpatterns = [
    path("sign-up", views.SignUp.as_view(), name="sign-up"),
    path("sign-in", views.SignIn.as_view(), name="sign-in"),
    path("sign-out", views.SignOut.as_view(), name="sign-out"),
    path("token", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh", TokenRefreshView.as_view(), name="token_refresh"),
    path("@<str:username>/", views.ShowProfile.as_view(), name="profile"),
    path("update-profile", views.UpdateProfile.as_view(), name="update-profile"),
    path("update-password", views.UpdatePassword.as_view(), name="update-password"),
]