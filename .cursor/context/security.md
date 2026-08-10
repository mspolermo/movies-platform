# Security Rules

Решение auth: [ADR-001](../adr/001-jwt-access-opaque-refresh.md).

## AuthN / AuthZ

- Access JWT: короткий TTL (`JWT_ACCESS_EXPIRES_IN`); подпись только в **auth-users**.
- Gateway: **verify-only** (`PRIVATE_KEY` shared secret).
- Refresh: opaque + hash в БД; ротация; reuse detection → revoke all user tokens.
- Refresh cookie: HttpOnly, Path `/api/auth` (через gateway path), SameSite=Lax.
- `has_session` — **не** security control.
- Защищённые роуты — `JwtAuthGuard` + Bearer (без `@Public`).
- Публичные роуты — class `JwtAuthGuard` + method `@Public` (optional Bearer). `JwtConfigModule` — `@Global()` (guard DI без import в каждом feature-модуле). Нужен до `APP_GUARD` / B38, иначе auth/health/catalog лягут 401.
- `/admin/*`: `JwtAuthGuard + RolesGuard + @Roles("ADMIN")` — рабочий (ADR-007 + specs). Не маскировать infra/RPC 5xx в 403 — **B41**.
- Текущий пользователь — только `GET /auth/me` (`/auth/checkToken` удалён).
- Swagger: `@ApiBearerAuth` **только** на JWT-required хендлерах/контроллерах (favorites, ratings, admin, auth `/me`, comments POST). Не ставить на `@Public` catalog — OpenAPI иначе врёт `security required`.

## CSRF / CORS

- `ALLOWED_ORIGINS` — whitelist для CORS и OriginGuard.
- OriginGuard обязателен на refresh/logout в production.
- Не ослаблять SameSite/Path cookie без ADR.

## Rate limit

- Auth endpoints: Throttler на gateway (login/register жёстче, refresh мягче).
- Не отключать throttling на auth в prod.

## Данные

- Пароли: bcrypt; никогда в логах/ответах.
- Не логировать tokens, Authorization headers, полные email без нужды.
- RMQ не экспонировать наружу Docker-сети на edge (local compose публикует 5672/15672 для DX; strip — I7); @production не `guest` и не DX-креды `mp` / `mp_dev_change_me` (`rmq.factory`).
- Client не хранит refresh; access только memory.

## Input

- ValidationPipe whitelist — обязателен на gateway.
- Не принимать `userId` от клиента для «от имени пользователя» — брать из JWT.

## Secrets

- Секреты только в `.env` (не коммитить). Ориентир имён — `.env.example`.
- Один `PRIVATE_KEY` для sign/verify — ротация = одновременный редеплой gateway + auth-users.
