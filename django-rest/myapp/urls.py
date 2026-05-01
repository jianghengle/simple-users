from django.urls import path
from .views import user_view

urlpatterns = [
    path('get-org-users/', user_view.get_org_users, name='get-org-users'),
    path('add-new-user/', user_view.add_new_user, name='add-new-user'),
]
