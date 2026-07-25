# Movies Platform

B2C-киноплатформа: каталог фильмов и людей, фильтры, поиск, комментарии, JWT-авторизация.  
Микросервисный backend (NestJS) + frontend на Next.js (FSD).

> **Для агентов и разработки:** канонический контекст — [`PROJECT_CONTEXT.md`](./PROJECT_CONTEXT.md)  
> (карта кода, правила, ADR). Этот README — обзор для GitHub.

## Возможности

- Каталог фильмов с фильтрами (жанр, страна, год, рейтинг)
- Карточки людей и фильмография
- Поиск по фильмам и персонам
- Комментарии и лайки
- Регистрация / логин / refresh (access в памяти, refresh в HttpOnly cookie)

## Стек

| Слой | Технологии |
|------|------------|
| Frontend | Next.js 16, React 19, FSD, Zustand, Axios, SCSS Modules |
| Backend | NestJS 11, Sequelize, PostgreSQL ×2, RabbitMQ, JWT, Swagger |
| Shared | `apps/common` — типы, DTO, RMQ-контракты |
| Infra | Docker Compose, RabbitMQ Management, PgAdmin |

## Архитектура (кратко)

```
Client → api-gateway (HTTP) → RabbitMQ → auth-users | kino-db → PostgreSQL
```

| Сервис | Роль | Порт |
|--------|------|------|
| `apps/client` | UI (вне compose) | 3000 |
| `api-gateway` | Публичный HTTP API | 5001 |
| `auth-users` | Users, JWT, refresh | 3001 |
| `kino-db` | Фильмы, люди, комментарии | 3002 |
| RabbitMQ | `users_queue` / `films_queue` | 5672 / 15672 |
| Postgres | kino `db`, users `db2` | 5432 / 5433 |

Подробности: [`.cursor/architecture.md`](./.cursor/architecture.md).

## Быстрый старт

```bash
cp .env.example .env
docker compose up -d --build

cd apps/client && npm install && npm run dev
```

- API / Swagger: http://localhost:5001/api/docs  
- UI: http://localhost:3000  
- RabbitMQ UI: http://localhost:15672 (`guest` / `guest`)  
- PgAdmin: http://localhost:5050  

Сброс данных kino: `docker compose down -v && docker compose up -d --build`.

## Репозиторий

```
apps/
  api-gateway/   # HTTP BFF
  auth-users/    # auth
  kino-db/       # контент
  common/        # shared types & RMQ
  client/        # Next.js FSD
.cursor/         # KB Cursor: rules, context, adr, skills, temp
PROJECT_CONTEXT.md
```

## Для контрибьюторов

1. Читать [`PROJECT_CONTEXT.md`](./PROJECT_CONTEXT.md)
2. Правила — [`.cursor/context/`](./.cursor/context/)
3. Решения — [`.cursor/adr/`](./.cursor/adr/)
4. После изменений документации — skill [`.cursor/skills/update-project-context/`](./.cursor/skills/update-project-context/)
