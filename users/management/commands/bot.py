import telebot
from django.conf import settings
from django.core.management.base import BaseCommand
from users.models import User

bot = telebot.TeleBot(settings.TELEGRAM_BOT_TOKEN)

@bot.message_handler(commands=['start'])
def handle_start(message):
    try:
        token = message.text.split()[1]
        user = User.objects.get(telegram_token=token)
        user.telegram_id = message.chat.id
        user.save()
        bot.send_message(message.chat.id, f"Аккаунт {user.username} привязан")
    except:
        bot.send_message(message.chat.id, "Неверный токен")

class Command(BaseCommand):
    help = 'Запуск Telegram бота'

    def handle(self, *args, **kwargs):
        bot.polling()


class send_attemp(BaseCommand):
    def handle(self, *args, **kwargs):
        bot.send_message(int(kwargs["chat_id"]), kwargs["message_text"])
