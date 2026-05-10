from django.urls import path
from .views import user_view
from .views import group_view

urlpatterns = [
    path('login-user/', user_view.login_user, name='login-user'),
    path('get-org-users/', user_view.get_org_users, name='get-org-users'),
    path('add-new-user/', user_view.add_new_user, name='add-new-user'),
    path('change-password/', user_view.change_password, name='change-password'),
    path('change-role/', user_view.change_role, name='change-role'),
    path('lock-user/', user_view.lock_user, name='lock-user'),
    path('unlock-user/', user_view.unlock_user, name='unlock-user'),
    path('get-org-groups/', group_view.get_org_groups, name='get-org-groups'),
    path('add-user-to-group/', group_view.add_user_to_group, name='add-user-to-group'),
    path('remove-user-from-group/', group_view.remove_user_from_group, name='remove-user-from-group'),
    path('remove-group/', group_view.remove_group, name='remove-group'),
]
