# Generated by Django 4.2.11 on 2024-06-06 22:33

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Attemp',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('wpm', models.PositiveSmallIntegerField(default=0)),
                ('accuracy', models.PositiveSmallIntegerField(default=0)),
                ('error_cnt', models.PositiveSmallIntegerField(default=0)),
                ('mode', models.CharField(blank=True, max_length=16, null=True)),
                ('attemp_time', models.DateTimeField(auto_now_add=True, verbose_name='Дата добавления')),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Пользователь')),
            ],
        ),
    ]
