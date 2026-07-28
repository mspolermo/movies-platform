# PROJECT_CONTEXT

Главный входной контекст для Cursor. Читать первым.

## Проект

B2C-киноплатформа: каталог фильмов, люди, жанры, страны, комментарии, рейтинги (KP/IMDB).  
Монорепа: NestJS-микросервисы + Next.js (FSD) клиент.

## Стек

| Слой | Технологии |
|------|------------|
| Backend | NestJS 11, Sequelize, PostgreSQL ×2, RabbitMQ, JWT, Swagger |
| Frontend | Next.js 16 (App Router), React 19, FSD, Zustand, Axios, SCSS Modules, Storybook 10, Vitest |
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
8. Действия фильма (rate/share/panel) — одна feature `openFilmActions`; entity context + card actions renderer; без соц-stubs. См. [ADR-004](.cursor/adr/004-open-film-actions.md).
9. Admin B2C `/admin/*` — FE stubs + soft-404; BE `/admin` + RolesGuard — later. См. [ADR-005](.cursor/adr/005-admin-in-b2c.md).
10. После задачи — [skill update-project-context](.cursor/skills/update-project-context/SKILL.md).

## Не путать

- `packages/` нет — shared = `apps/common`.
- React Query нет — axios + Server Actions + `usePaginatedResource`.
- Playwright/Cypress нет — Jest (backend), Vitest + Storybook (client). E2E без ADR не добавлять.
- Agent KB целиком под `.cursor/` (кроме этого файла и `README.md`).
- `README.md` — витрина GitHub, не канон для агентов (этот файл — вход).
- Auto-rules: только `.cursor/rules/*.mdc` (корневого `.cursorrules` нет).
- Always-on: `project-context.mdc`, `common-types-rules.mdc`.
- Glob FE (`frontend-dev-rules.mdc`) → `@.cursor/context/frontend.md` (+ naming, api).
- Glob BE (`backend-dev-nest-rules.mdc`) → `@.cursor/context/backend.md` (+ api, microservices, naming).
- `.cursor/context/*.md` — императивы; при конфликте с mdc побеждает **context/** (кроме common-types).
