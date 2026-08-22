from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ("Family Hub", {"fields": ("role", "family_name")}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ("Family Hub", {"fields": ("role", "family_name")}),
    )
    list_display = ("username", "email", "role", "family_name", "is_active")