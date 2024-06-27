from django.urls import path 
from . import views


urlpatterns = [
    path('', views.home, name='home'),
    path('home/', views.home, name='home'),
    path('register/', views.register, name='register'),
    path('sign_in/', views.sign_in, name='sign_in'),
    path('company_page/', views.company_page, name='company_page'),
    path('sign_out/', views.sign_out, name='sign_out'),
    path('add_bussiness/', views.add_bussiness, name='add_bussiness'),
    path('remove_bussiness/', views.remove_bussiness, name='remove_bussiness'),
    path('bussiness_board/', views.bussiness_board, name='bussiness_board'),
    path('add_items/', views.add_items, name='add_items'),
    path('update_and_delete_item/', views.update_and_delete_item, name='update_and_delete_item'),
    path('add_location/', views.add_location, name='add_location'),
    path('add_sales/', views.add_sales, name='add_sales'),
    path('update_and_delete_location/', views.update_and_delete_location, name='update_and_delete_location'),
    path('update_and_delete_sales/', views.update_and_delete_sales, name='update_and_delete_sales'),
    path('add_purchase/', views.add_purchase, name='add_purchase'),
    path('update_and_delete_purchase/', views.update_and_delete_purchase, name='update_and_delete_purchase'),
]