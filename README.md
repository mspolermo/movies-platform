# 🎬 Movies Platform

Киноплатформа с микросервисным backend на NestJS и современным frontend на Next.js 14 (FSD, TypeScript, SCSS). B2C-продукт, собирающий API вокруг доменной модели (фильмы, люди, жанры, страны, комментарии, рейтинги) и обёрнутый в Docker-инфраструктуру.

## 🎯 Назначение проекта

B2C-платформа для поиска и изучения информации о фильмах. Пользователи могут:
- Просматривать каталог фильмов с фильтрацией по жанрам, странам, годам, рейтингам
- Изучать информацию о людях (актёры, режиссёры, сценаристы) и их фильмографию
- Оставлять комментарии и оценки к фильмам
- Искать фильмы и людей по запросу

## 📁 Структура проекта

### Backend (`apps/`)

```
apps/
├── api-gateway/          # Единая точка входа, маршрутизация запросов
│   └── src/
│       ├── auth/         # Аутентификация (прокси к auth-users)
│       ├── films/        # Фильмы (прокси к kino-db)
│       ├── persons/      # Люди (прокси к kino-db)
│       ├── comments/     # Комментарии (прокси к kino-db)
│       ├── search/       # Глобальный поиск
│       └── shared/       # Guards, pipes, exceptions
├── auth-users/           # Микросервис пользователей
│   └── src/
│       ├── users/        # CRUD пользователей
│       └── roles/        # Роли и права доступа
├── kino-db/              # Микросервис данных о фильмах
│   └── src/
│       ├── films/        # Фильмы, связи с жанрами/странами/людьми
│       ├── persons/      # Люди и профессии
│       ├── comments/     # Комментарии к фильмам
│       └── genres/       # Жанры и страны
└── common/               # Общие DTO и типы
```

### Frontend (`apps/client/src/`)

FSD-архитектура (Feature-Sliced Design):

```
src/
├── app/                  # Next.js App Router страницы
├── entities/             # Бизнес-сущности (film, person, profession)
│   └── film/
│       ├── api/          # API запросы
│       ├── ui/           # UI компоненты (FilmCard, FilmDetail)
│       └── lib/          # Утилиты и хуки
├── features/             # Функциональные модули
│   ├── auth/             # Аутентификация
│   ├── filterFilms/      # Фильтрация фильмов
│   ├── searchFilmsAndPersonsByQuery/  # Поиск
│   └── loadMoreFilms/    # Пагинация
├── widgets/              # Композитные компоненты
│   ├── Layout/           # Шапка, футер, навигация
│   └── FilmCreatorsViewer/  # Отображение создателей фильма
├── pages/                # Страницы приложения
│   ├── FilmsPage/        # Список фильмов
│   ├── FilmDetailPage/   # Детали фильма
│   └── PersonDetailPage/ # Детали человека
└── shared/               # Общие ресурсы
    ├── api/              # API клиент и эндпойнты
    ├── ui/               # Переиспользуемые UI компоненты
    └── types/            # TypeScript типы
```

## 💡 Примеры использования

### Аутентификация

```bash
# Регистрация
curl -X POST http://localhost:5001/auth/registration \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123", "name": "User"}'

# Логин
curl -X POST http://localhost:5001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

### Работа с фильмами

```bash
# Получить фильм по ID
curl http://localhost:5001/films/1

# Поиск фильмов с фильтрами
curl "http://localhost:5001/films?genre=драма&year=2020&rating=7&page=1&limit=20"

# Получить создателей фильма по профессии
curl "http://localhost:5001/films/1/persons-by-profession?profession=Режиссёр&page=1&limit=10"
```

### Комментарии (требуется JWT токен)

```bash
# Получить комментарии к фильму
curl http://localhost:5001/comments/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Создать комментарий
curl -X POST http://localhost:5001/comments/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text": "Отличный фильм!"}'
```

### Поиск

```bash
# Глобальный поиск по фильмам и людям
curl "http://localhost:5001/search?name=Тарковский" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔑 Ключевые решения

### Архитектура

- **Микросервисы**: разделение на api-gateway (маршрутизация), auth-users (пользователи), kino-db (контент)
- **API Gateway**: единая точка входа, централизованная авторизация, агрегация данных из микросервисов
- **RabbitMQ**: асинхронная коммуникация между микросервисами через очереди
- **Разделение БД**: отдельные PostgreSQL-инстансы для пользователей и контента (изоляция данных)

### Frontend

- **FSD-архитектура**: чёткое разделение на слои (entities → features → widgets → pages)
- **Next.js App Router**: серверные компоненты, встроенная оптимизация, SEO
- **Zustand**: лёгкий state management для аутентификации и UI состояния
- **SCSS Modules**: изолированные стили, избежание конфликтов

### Безопасность

- **JWT**: токены для аутентификации, refresh-механизм
- **Guards**: ролевая модель доступа (Public, JwtAuthGuard, RolesGuard)
- **Валидация**: class-validator для DTO на входе в API

### Инфраструктура

- **Docker Compose**: оркестрация всех сервисов, health checks, зависимости
- **Автоматическая инициализация**: SQL-дампы загружаются при первом запуске
- **Health checks**: мониторинг состояния сервисов

## 🏗️ Технологический стек

- **Backend**: NestJS 9, PostgreSQL + Sequelize, RabbitMQ, JWT, Swagger
- **Frontend**: Next.js 14 (App Router), React 18, FSD-архитектура, Zustand, SCSS-модули
- **Инфраструктура**: Docker Compose, два PostgreSQL-инстанса, pgAdmin, RabbitMQ management
- **Тестирование**: Jest + Supertest для backend, Vitest + Testing Library для frontend

## 🌐 Доступные сервисы локально

- **API Gateway**: http://localhost:5001 (внешний порт; внутри Docker — 5000)
- **Auth Users**: http://localhost:3001  
- **Kino DB**: http://localhost:3002
- **Frontend**: http://localhost:3000
- **PgAdmin**: http://localhost:5050 (admin@example.com / admin)
- **RabbitMQ**: http://localhost:15672 (guest / guest)

## 🚀 Быстрый старт

### Требования

- Docker, Docker Compose
- `.env` файл в корне проекта (порты, креды Postgres, очереди RabbitMQ, JWT)

### Запуск

```bash
# Запуск всего стенда (backend + БД + инфраструктура)
docker compose up -d --build

# Запуск фронтенда отдельно
cd apps/client
npm install
npm run dev
```

После старта backend-микросервисы и базы поднимаются автоматически с начальными дампами.
