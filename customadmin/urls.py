from django.urls import path
from . import views


app_name = 'customadmin'
urlpatterns = [
    path('home/', views.home, name='homeAdmin'),
    path('home/dashboard/default/', views.dashboard, name='dashboard'),
    path('home/apps/ecommerce/catalog/products/', views.ProductClass.as_view(), name='products'),
    path('home/deleteProduct/', views.DeleteProduct.as_view(), name='deleteProduct'),
    path('home/apps/ecommerce/sales/orderApproval/', views.OrderApproval.as_view(), name='orderApproval'),
    path('home/apps/ecommerce/sales/orderApproval/detail/<str:order_id>/', views.OrderDetail.as_view(), name='orderDetail')
]
