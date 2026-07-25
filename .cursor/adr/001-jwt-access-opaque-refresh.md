# 001. JWT access + opaque refresh (HttpOnly cookie)

- **Статус:** Accepted
- **Дата:** 2026-07-14
- **Участники:** —

## Контекст

Нужна B2C-аутентификация для SPA/Next: короткоживущий доступ к API без хранения долгого секрета в JS, с защитой от XSS на refresh и без полноценного CSRF-токена на cookie-эндпоинтах.

## Решение

Двухтокенная схема:

| Токен | Где | Свойства |
|-------|-----|----------|
| Access | JWT, in-memory на клиенте | TTL `JWT_ACCESS_EXPIRES_IN` (default 15m); Bearer на gateway |
| Refresh | Opaque, HttpOnly cookie | Path `/api/auth`, SameSite=Lax; hash SHA-256 в `refresh_tokens`; TTL 30 дней |
| `has_session` | Cookie, не HttpOnly | Только UX для `apps/client/proxy.ts` — **не** security |

Границы ответственности:

- **auth-users** — bcrypt, sign JWT, хранение/ротация refresh, reuse detection → revoke all
- **api-gateway** — verify-only JWT, Set-Cookie / clear, Throttler, OriginGuard (prod) на refresh/logout
- **client** — access вне React/zustand/localStorage; single-flight refresh на 401

Дополнительно:

- Отдельный CSRF-токен не вводим (SameSite + Path + OriginGuard + same-origin на access в ответе)
- Один `PRIVATE_KEY` для sign (auth-users) и verify (gateway)
- Throttle: login/registration жёстче, refresh мягче

Императивы: [`.cursor/context/security.md`](../context/security.md).  
Потоки: [`.cursor/architecture.md`](../architecture.md).

## Последствия

**Плюсы**

- Refresh недоступен JS (XSS не крадёт долгоживущий токен)
- Короткий access снижает окно компрометации
- Rotation + reuse detection ловят кражу refresh

**Минусы / риски**

- Shared symmetric secret → ротация = lockstep gateway + auth-users
- Hard reload до bootstrap: нет access, пока не отработает refresh
- RMQ payload (`userId`) доверяется внутри docker-сети без подписи сообщений
- `has_session` можно подделать → только ложный UX-редирект

**Поддержка**

- Cookie Path должен совпадать с Next rewrite `/api/auth`
- Не класть access в zustand/storage без нового ADR

## Альтернативы

1. **Только session cookie (серверные сессии)** — проще XSS-модель, хуже горизонтальное масштабирование без sticky/store; отвергли ради JWT API.
2. **Refresh в localStorage** — удобнее SSR bootstrap, неприемлемо при XSS.
3. **JWT refresh без rotation/opaque store** — нельзя отозвать и детектить reuse.
4. **Отдельный CSRF-токен** — избыточен при SameSite=Lax + OriginGuard + узком Path.
