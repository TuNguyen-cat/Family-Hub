from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = [
        ("parent", "Ba/Mẹ"),
        ("child", "Con"),
        ("other", "Khác"),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="parent")
    family_name = models.CharField(max_length=100, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username