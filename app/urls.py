from django.urls import path
from . import views

app_name = 'web'
urlpatterns = [
    path('home/', views.main, name='main'),
    path('cart/', views.ShopCart.as_view(), name='shop-cart'),
]
