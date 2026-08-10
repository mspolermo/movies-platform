# API Rules

Индекс эндпоинтов и RPC: [`../project-index.md`](../project-index.md).

## Публичный HTTP (api-gateway)

- Единственная точка входа для клиента.
- REST + JSON; Swagger `/api/docs` — только если `NODE_ENV !== "production"` (B26 thin).
- Версионирования URL нет — breaking changes согласовывать; при необходимости — ADR.
- Auth: Bearer access; refresh/logout — cookie + OriginGuard (prod).
- Публичные роуты: class `JwtAuthGuard` + method `@Public` (optional Bearer; B38). `JwtConfigModule` — `@Global()`.
- Swagger `@ApiBearerAuth` — только JWT-required (не на `@Public`).
- Текущий пользователь — `GET /auth/me` (`/auth/checkToken` удалён).
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
- Swagger response DTO на gateway: `implements T*Response` + `@ApiOkResponse({ type })`. Доменный owner (`FilmListItemResponseDto` → `films/dto`; search/professions реиспользуют).

## RPC

- Все pattern’ы — в `apps/common/services/rmq/messaging/`.
- Gateway clients вызывают только через `RmqService` / typed helpers.
- Не использовать ad-hoc строковые pattern в контроллерах.

## Клиентский API-слой

- Browser: `baseURL` = `BROWSER_API_BASE_URL` (`/api`), `withCredentials: true`.
- SSR: `API_GATEWAY_URL` из `@common/constants` / env — через `getApiBaseUrl` (`shared/lib`).
- Пути REST — **только** `shared/api/endpoints.ts` (не хардкод в UI); SSR gateway URL — `API_GATEWAY_URL` (`@common/constants/network`). Зачем — [ADR-001](../adr/001-jwt-access-opaque-refresh.md) (§ «endpoints.ts»), [ADR-009](../adr/009-compose-port-topology.md).
- 401 → single-flight refresh → retry; провал → `sessionBridge.onSessionExpired`. Детали session/ESLint — тот же ADR.

## Запреты

- Не открывать бизнес-HTTP MS наружу.
- Не отдавать ORM/entity поля «лишним» набором без нужды (overfetch осознанно).
- Comments/отзывы — **без** `parentId` / nested create (см. [ADR-002](../adr/002-flat-film-reviews.md)).
