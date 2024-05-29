from django.urls import path
from . import views

app_name = 'login'
urlpatterns = [
    path('login/', views.UserLogin.as_view(), name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('signup/', views.UserSignUp.as_view(), name='signup'),
]
