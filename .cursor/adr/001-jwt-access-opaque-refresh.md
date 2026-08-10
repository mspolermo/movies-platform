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
- **client** — access вне React/zustand/localStorage; single-flight refresh на 401; sessionBridge → store

### Клиент (FSD ownership)

| Слой | Роль |
|------|------|
| `src/app/providers` | Composition: `AuthProvider` → `FilmActionsProvider` |
| `features/auth` | Сценарии: forms, `authActions`, реализация `AuthProvider` |
| `entities/user` | Identity: `useUserStore`, `useAuth`, `buildLoginHref` |
| `shared/api` | Transport: `endpoints.ts`, `auth/*`, `session/` (папка на модуль + `constants.ts`); публичный barrel — узкий |
| `apps/client/proxy.ts` | Thin Next 16: `@/shared/api/session` (edge-safe) + `resolveSessionRedirect`; `config.matcher` **только** static string literals |

### Клиент: `endpoints.ts` (пути + base URL)

Единый источник REST-путей — `shared/api/endpoints.ts` (`API_ENDPOINTS`, `BROWSER_API_BASE_URL`). SSR gateway URL — `API_GATEWAY_URL` (`@common/constants/network`, ADR-009).

**Почему не хардкод в компонентах / не `shared/constants`:**

- Один файл рядом с axios/`auth/*` — смена пути или base не размазывается по UI.
- `shared/constants` — домен/locale/UI, не HTTP-контракт; смешение даёт ложные зависимости и дубли (`/films` в двух местах).
- `getApiBaseUrl` (`shared/lib`) читает consts **из** `endpoints.ts`, не через api barrel — иначе Edge/lib тянут axios-клиент.

### Клиент: два публичных входа API + ESLint

| Импорт | Что | Зачем |
|--------|-----|--------|
| `@/shared/api` | default `apiClient` + `auth/*` + `endpoints` | App HTTP (браузер/SSR с axios) |
| `@/shared/api/session` | edge-safe: consts cookie/paths, token, cookie, bridge, bootstrap, `resolveSessionRedirect` | `proxy.ts` и UX без axios |

`session/index` **не** реэкспортирует `apiClient` / `performTokenRefresh` / `notify*` / bootstrap `wait*` / `SESSION_*` — иначе Edge и любой импорт session тянут axios или внутренности.

`auth/*` и default barrel ходят в axios через deep `session/apiClient` — единственный deep-entry.

**ESLint** (`configs/eslint/fsdconfig.mjs`):

- `sharedPublicApiAllow` — разрешает `@/shared/api/session` как второй public API слайса `shared/api` (иначе `import/no-internal-modules` требует только `shared/api` → axios в Edge).
- `apiClientDeepAllow` — разрешает deep `session/apiClient` **внутри** api-слайса; снаружи — нет.

### Клиент: session UX

- Layout: `shared/api/session/<module>/` (impl + test + barrel) + `constants.ts` (`AUTH_*_PATH`, `HAS_SESSION_*`, `SESSION_*` — последние только внутри session).
- Identity: `useAuth` / store — `@/entities/user`; сценарии login/logout/bootstrap — `@/features/auth` (`authActions`).
- 401 → single-flight refresh → retry; провал → clear access + UX-cookie → `sessionBridge.onSessionExpired` → `buildLoginHref()`.
- Guest / session-expired → логин: `buildLoginHref()` (с `returnUrl`).
- Намеренный logout → `AUTH_LOGIN_PATH` **без** `returnUrl` (не возвращать на страницу, с которой вышли).
- Proxy matcher — литералы в `proxy.ts`; sync с `SESSION_*` — тест, импортирующий `config` из `proxy.ts`.

Дополнительно:

- Отдельный CSRF-токен не вводим (SameSite + Path + OriginGuard + same-origin на access в ответе)
- Один `PRIVATE_KEY` для sign (auth-users) и verify (gateway)
- Throttle: login/registration жёстче, refresh мягче

Императивы: [`.cursor/context/security.md`](../context/security.md), кратко [api.md](../context/api.md) / [frontend.md](../context/frontend.md).  
Потоки: [`.cursor/architecture.md`](../architecture.md).

## Последствия

**Плюсы**

- Refresh недоступен JS (XSS не крадёт долгоживущий токен)
- Короткий access снижает окно компрометации
- Rotation + reuse detection ловят кражу refresh
- Edge не тащит axios; пути REST в одном месте

**Минусы / риски**

- Shared symmetric secret → ротация = lockstep gateway + auth-users
- Hard reload до bootstrap: нет access, пока не отработает refresh
- RMQ payload (`userId`) доверяется внутри docker-сети без подписи сообщений
- `has_session` можно подделать → только ложный UX-редирект
- Два public entry (`api` / `api/session`) + whitelist в ESLint — нужно держать в sync с ADR

**Поддержка**

- Cookie Path должен совпадать с Next rewrite `/api/auth`
- Не класть access в zustand/storage без нового ADR
- Новые REST-пути — только в `endpoints.ts`; UI-роуты auth/protected — в `session/constants` (+ matcher/proxy sync)
- Не расширять `session/index` axios-символами; deep `apiClient` — только внутри `shared/api`
- Меняя allowlist в `fsdconfig.mjs` — сверять с таблицей «два публичных входа» выше

## Альтернативы

1. **Только session cookie (серверные сессии)** — проще XSS-модель, хуже горизонтальное масштабирование без sticky/store; отвергли ради JWT API.
2. **Refresh в localStorage** — удобнее SSR bootstrap, неприемлемо при XSS.
3. **JWT refresh без rotation/opaque store** — нельзя отозвать и детектить reuse.
4. **Отдельный CSRF-токен** — избыточен при SameSite=Lax + OriginGuard + узком Path.
5. **Один barrel `@/shared/api` для proxy** — проще импорты, но Edge/proxy тянут axios; отвергли ради edge-safe `session`.
6. **Пути REST в `shared/constants`** — смешивает UI/locale с HTTP-контрактом; отвергли ради `endpoints.ts` рядом с клиентом.
