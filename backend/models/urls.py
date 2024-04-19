from django.urls import path
from . import views

"""
urlpatterns = [
    path("", views.QuizApp.as_view(), name="quiz_app"), 
    path("about/", views.About.as_view(), name="about"), 
    path("services/", views.Servies.as_view(), name="services"), 
]
"""

urlpatterns = [
    path("", views.Home.as_view(), name="home"), 
]