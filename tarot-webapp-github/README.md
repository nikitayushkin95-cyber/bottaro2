# Tarot Bot WebApp

Telegram WebApp для выбора карт Таро в боте-тарологе.

## Файлы

- `index.html` - Основная страница WebApp для выбора карт
- `style.css` - Стили для WebApp
- `admin.html` - Админ панель (для локального использования)
- `admin.css` - Стили админ панели
- `admin.js` - JavaScript админ панели
- `static/` - Статические файлы (изображения карт)

## Использование

Этот WebApp предназначен для интеграции с Telegram ботом через GitHub Pages.

После загрузки на GitHub Pages, WebApp будет доступен по HTTPS адресу:
`https://ваш-username.github.io/название-репозитория/`

## Настройка в боте

Обновите `WEBAPP_BASE_URL` в файле `.env` бота на адрес GitHub Pages.
