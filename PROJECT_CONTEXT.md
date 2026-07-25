# PROJECT_CONTEXT

Главный входной контекст для Cursor. Читать первым.

## Проект

B2C-киноплатформа: каталог фильмов, люди, жанры, страны, комментарии, рейтинги (KP/IMDB).  
Монорепа: NestJS-микросервисы + Next.js (FSD) клиент.

## Стек

| Слой | Технологии |
|------|------------|
| Backend | NestJS 11, Sequelize, PostgreSQL ×2, RabbitMQ, JWT, Swagger |
| Frontend | Next.js 16 (App Router), React 19, FSD, Zustand, Axios, SCSS Modules |
| Shared | `apps/common` — types, dto, RMQ, constants |
| Infra | Docker Compose, PgAdmin, RabbitMQ management |

## Архитектура одной строкой

`Client → api-gateway (HTTP) → RabbitMQ RPC → auth-users | kino-db → PostgreSQL → Mapper → Response`

## Обязательные ссылки

| Документ | Назначение |
|----------|------------|
| [`.cursor/project-index.md`](.cursor/project-index.md) | Карта сервисов, API, RPC, «где искать код» |
| [`.cursor/architecture.md`](.cursor/architecture.md) | Слои и потоки данных |
| [`.cursor/dependency-graph.md`](.cursor/dependency-graph.md) | Дерево вызовов |
| [`.cursor/glossary.md`](.cursor/glossary.md) | Термины |
| [`.cursor/context/`](.cursor/context/) | Правила (императив) |
| [`.cursor/adr/`](.cursor/adr/) | Architecture Decision Records |
| [`.cursor/skills/update-project-context/`](.cursor/skills/update-project-context/) | Обновление контекста после задач |
| [`.cursor/temp/`](.cursor/temp/) | Черновики, аудиты, техдолг |

## Правила (кратко)

1. Клиент: только `import type { … } from '@common/types'` (request/response).
2. ORM/entity наружу не отдавать — только `T*Response` через mapper.
3. Новый RPC — в `apps/common/services/rmq/messaging/*` + оба конца.
4. FSD: зависимости только вниз (`pages → widgets → features → entities → shared`).
5. Access token — in-memory; refresh — HttpOnly cookie; `has_session` — UX (`proxy.ts`). См. [ADR-001](.cursor/adr/001-jwt-access-opaque-refresh.md).
6. Отзывы к фильму — плоский список, без дерева/`parentId`. См. [ADR-002](.cursor/adr/002-flat-film-reviews.md).
7. Home promo — статика в `widgets/PromoBannerSlider` (не в `HorizontalCarousel`); без клика/API; CMS/админка — отдельный ADR. См. [ADR-003](.cursor/adr/003-home-promo-banner-slider.md).
8. После задачи — [skill update-project-context](.cursor/skills/update-project-context/SKILL.md).

## Не путать

- `packages/` нет — shared = `apps/common`.
- React Query нет — axios + Server Actions + `usePaginatedResource`.
- Playwright/Cypress нет — Jest (backend), Vitest (client).
- Agent KB целиком под `.cursor/` (кроме этого файла и `README.md`).
- `README.md` — витрина GitHub, не канон для агентов (этот файл — вход).
- Auto-rules: только `.cursor/rules/*.mdc` (корневого `.cursorrules` нет).
- Always-on: `project-context.mdc`, `common-types-rules.mdc`.
- Glob FE (`frontend-dev-rules.mdc`) → `@.cursor/context/frontend.md` (+ naming, api).
- Glob BE (`backend-dev-nest-rules.mdc`) → `@.cursor/context/backend.md` (+ api, microservices, naming).
- `.cursor/context/*.md` — императивы; при конфликте с mdc побеждает **context/** (кроме common-types).
