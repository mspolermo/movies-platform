# Security Rules

Решение auth: [ADR-001](../adr/001-jwt-access-opaque-refresh.md).

## AuthN / AuthZ

- Access JWT: короткий TTL (`JWT_ACCESS_EXPIRES_IN`); подпись только в **auth-users**.
- Gateway: **verify-only** (`PRIVATE_KEY` shared secret).
- Refresh: opaque + hash в БД; ротация; reuse detection → revoke all user tokens.
- Refresh cookie: HttpOnly, Path `/api/auth` (через gateway path), SameSite=Lax.
- `has_session` — **не** security control.
- Защищённые роуты — `JwtAuthGuard` + Bearer.
- RolesGuard/RBAC не считать рабочим, пока не восстановлен и не покрыт тестами.

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
- RMQ не экспонировать наружу Docker-сети.
- Client не хранит refresh; access только memory.

## Input

- ValidationPipe whitelist — обязателен на gateway.
- Не принимать `userId` от клиента для «от имени пользователя» — брать из JWT.

## Secrets

- Секреты только в `.env` (не коммитить). Ориентир имён — `.env.example`.
- Один `PRIVATE_KEY` для sign/verify — ротация = одновременный редеплой gateway + auth-users.
