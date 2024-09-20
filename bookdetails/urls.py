from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from django.contrib.auth import views as auth_views
from .views import login_view, index,signup_view,buybook
from .views import logout_view,wishlist_view,add_to_wishlist,remove_from_wishlist,loadReviews
from . import views

 

urlpatterns = [
    path('', index, name='index'),
    path('index', index, name='index'),
    path('login/', login_view, name='login'),
    path('signup/', signup_view, name='signup'),
    #path('buybook/',buybook,name='buybook'),
    path('buybook/<book_id>', views.buybook, name='buybook'),
    path('savereview', views.savereview, name='savereview'),
    path('logout/', logout_view, name='logout'),
    path('loadReviews/<int:book_id>', views.loadReviews, name='loadReviews'),
    
    
    path('wishlist/',views. wishlist_view, name=' wishlist_view'),

    path('add_to_wishlist/', views. add_to_wishlist, name='add_to_wishlist'),
    path('wishlist/remove/<int:book_id>/',views. remove_from_wishlist, name='remove_from_wishlist'),
]
    

     

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.MEDIA_ROOT)

