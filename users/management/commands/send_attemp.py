from django.core.management.base import BaseCommand
import telebot
from django.conf import settings
from .bot import bot

class Command(BaseCommand):
    help = 'Отправка сообщения через Telegram бота'

    def add_arguments(self, parser):
        parser.add_argument('chat_id', type=int, help='ID чата, куда отправить сообщение')
        parser.add_argument('message_text', type=str, help='Текст сообщения')

    def handle(self, *args, **kwargs):
        chat_id = kwargs['chat_id']
        message_text = kwargs['message_text']
        bot.send_message(chat_id, message_text)