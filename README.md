# 🎬 Movies Platform

Киноплатформа

## 🏗️ Архитектура

Backend: Микросервисная архитектура на NestJS, Frontend: FSD на Next.js

- **api-gateway** (порт 5000) - API шлюз для всех запросов
- **auth-users** (порт 3001) - аутентификация и управление пользователями  
- **kino-db** (порт 3002) - основной сервис с данными о фильмах
- **client** - Next.js фронтенд приложение

## 📁 Структура проекта

```
├── apps/                 # Микросервисы
│   ├── api-gateway/     # API шлюз
│   ├── auth-users/      # Аутентификация
│   ├── kino-db/         # Данные фильмов
│   └── client/          # Фронтенд
├── devops/              # Docker и SQL скрипты
├── docs/                # Документация
└── docker-compose.yml   # Конфигурация сервисов
```

## 🌐 Доступные сервисы

- **API Gateway**: http://localhost:5000
- **Auth Users**: http://localhost:3001  
- **Kino DB**: http://localhost:3002
- **Frontend**: http://localhost:3000
- **PgAdmin**: http://localhost:5050 (admin@example.com/admin)
- **RabbitMQ**: http://localhost:15672 (guest/guest)

## 📚 Документация

