# API Rules

Индекс эндпоинтов и RPC: [`../project-index.md`](../project-index.md).

## Публичный HTTP (api-gateway)

- Единственная точка входа для клиента.
- REST + JSON; документация — Swagger `/api/docs`.
- Версионирования URL нет — breaking changes согласовывать; при необходимости — ADR.
- Auth: Bearer access; refresh/logout — cookie + OriginGuard (prod).
- Ошибки: стабильные HTTP status + предсказуемое тело; не протекать stack trace в prod.

## Контракты типов

- Ответы/запросы описываются в `@common/types` (response/request).
- Gateway и MS должны соглашаться на одни и те же `T*`.
- Даты в JSON — ISO string.
- Пагинация: единые поля (`page`/`limit` или как уже принято в домене) — не плодить форматы.

## DTO

- Вход HTTP валидировать DTO (`class-validator`).
- Общие auth/comment DTO — `@common/dto`.
- Не дублировать «тот же» интерфейс в types, если можно опереться на существующий тип.

## RPC

- Все pattern’ы — в `apps/common/services/rmq/messaging/`.
- Gateway clients вызывают только через `RmqService` / typed helpers.
- Не использовать ad-hoc строковые pattern в контроллерах.

## Клиентский API-слой

- Browser: `baseURL: '/api'`, `withCredentials: true`.
- SSR: `API_GATEWAY_URL`.
- Endpoints — `shared/api/endpoints.ts` (или аналог); не хардкодить URL по компонентам.
- 401 → single-flight refresh → retry; провал → logout UX.

## Запреты

- Не открывать бизнес-HTTP MS наружу.
- Не отдавать ORM/entity поля «лишним» набором без нужды (overfetch осознанно).
- Deprecated (`/auth/checkToken`) не использовать в новом коде.
- Comments/отзывы — **без** `parentId` / nested create (см. [ADR-002](../adr/002-flat-film-reviews.md)).
