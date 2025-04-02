import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    symbols_typed = models.PositiveIntegerField(default=0, verbose_name="Total symbols typed")
    telegram_id = models.CharField(max_length=32, blank=True, null=True)
    telegram_token = models.UUIDField(default=uuid.uuid4, unique=True, null=True, blank=True)
    class Meta:
        db_table = 'user'
        verbose_name = 'Пользователя'
        verbose_name_plural = 'Пользователи'

    def __str__(self) -> str:
        return self.username
    





class Attemp(models.Model):
    user = models.ForeignKey(
        to=User, on_delete=models.CASCADE, verbose_name="Пользователь", blank=True, null=True
    )
    wpm = models.PositiveSmallIntegerField(default=0)
    accuracy = models.PositiveSmallIntegerField(default=0)
    error_cnt = models.PositiveSmallIntegerField(default=0)
    mode = models.CharField(max_length=16, null=True, blank=True)
    attemp_time = models.DateTimeField(
        auto_now_add=True, verbose_name="Дата добавления"
    )




