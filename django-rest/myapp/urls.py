from django.urls import path
from .views import user_view

urlpatterns = [
    path('get-org-users/', user_view.get_org_users, name='get-org-users'),
]
