#  ⌨️ Type


**Type** – это интерактивный веб-симулятор для обучения слепой печати, интегрированный с Telegram-ботом для персональных уведомлений и отслеживания прогресса.
## О проекте

### 🛠️ Технологический стек

Проект написан на Python и требует следующих пакетов (см. [requirement.txt](./requirement.txt)):
- Django==4.2.11
- psycopg2==2.9.9
- telebot==0.0.5
- python-dotenv==1.1.0
- а также другие зависимости

## 📦 Установка и запуск 

### 1. Клонирование репозитория

```bash
git clone https://github.com/A-re-s/type.git
cd type
```

### 2. Создание виртуального окружения

Рекомендуется использовать виртуальное окружение для изоляции зависимостей:

```bash
python -m venv venv
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate     # Windows
```

### 3. Установка зависимостей

Установите необходимые пакеты:

```bash
pip install -r requirement.txt
```

### 4. Настройка переменных окружения (.env)

Создайте файл `.env` в корневой директории и добавьте в него следующие настройки:

```env
# Настройки Django
SECRET_KEY=ваш_секретный_ключ
DEBUG=True

# Настройки базы данных
DB_NAME=имя_вашей_бд
DB_USER=ваш_пользователь
DB_PASSWORD=ваш_пароль
DB_HOST=127.0.0.1
DB_PORT=5432

# Настройка Telegram-бота
TELEGRAM_BOT_TOKEN=ваш_токен
```

Эти переменные используются для конфигурации Django, подключения к базе данных PostgreSQL и настройки Telegram-бота.

### 5. Применение миграций

Выполните миграции для создания структуры базы данных:

```bash
python manage.py migrate
```

### 6. Запуск сервера

Запустите локальный сервер разработки:

```bash
python manage.py runserver
```

### 7. Телеграм бота

Запустите nелеграм бота:

```bash
python manage.py bot
```

Приложение будет доступно по адресу [http://127.0.0.1:8000/](http://127.0.0.1:8000/).

## Структура проекта

```
type/
├── app/              # Основной модуль проекта (настройки, urls и пр.)
├── users/            # Модуль для работы с пользователями
├── top/              # Модуль для лидерборда
├── templates/        # HTML-шаблоны
├── static/deps/      # Статические файлы (CSS, JS, изображения и пр.)
├── manage.py         # Скрипт для управления проектом Django
└── requirement.txt   # Список зависимостей проекта
```
