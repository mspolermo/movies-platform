# Архитектурный аудит backend

**Дата:** 2026-08-02 (обновление Gateway & Integration Audit)  
**Предыдущий срез:** 2026-07-19 (устарел по RolesGuard/Nest/admin)  
**Стек:** NestJS 11 · TypeScript · RabbitMQ (ClientProxy RPC) · Sequelize · PostgreSQL ×2  
**Объём этого среза:** `api-gateway` + `apps/common` (types/dto/rmq) + RPC-стыки MS  
**Вне scope среза:** `apps/client`; глубокий data-слой Sequelize/SQL — **фаза 2** (долг ниже сохранён)

**Lens:** учебный/MVP monorepo с claim на production-habits.

---

## Часть 1. Общий вердикт

### Итоговый уровень: **Strong Middle (~6.2/10 weighted)**

Сильное: единственная HTTP-граница; typed RMQ без orphans; ADR-001 refresh rotation; ADR-007/008 admin+prefs; RolesGuard **живой**; `@common/types` дисциплина; prefs/admin на `fromRpc` + хорошие Jest.

Слабое для prod: нет RPC timeout; `/health` всегда 200; RMQ/`guest` + HTTP side-doors MS; `fromRpc` дырявый на каталоге/auth/comments; Swagger всегда on; filters fan-out ×3; phrase-match auth errors.

| Ось | Вес | Score | Почему |
|-----|-----|-------|--------|
| Boundaries & orchestration | 0.20 | **7/10** | Границы чистые; filters/health smells |
| RPC contracts & resilience | 0.20 | **5/10** | Stitches 100%; timeout/DLQ/fromRpc слабые |
| Gateway implementation | 0.20 | **7/10** | Тонкие controllers; auth/comments error debt |
| Shared types/DTO | 0.15 | **8/10** | Лучший слой; pagination drift |
| Security posture | 0.15 | **5/10** | Auth зрелый; RMQ trust = P0 |
| Testability & ops | 0.10 | **4/10** | Health ложный; gateway specs дырявые |
| **Weighted (integration)** | | **~6.2** | |
| База данных (фаза 2, не пересчитана) | — | **~4/10** | synchronize; индексы; ILIKE — срез 19.07 |

---

## Часть 2. P0 / P1 (deduped)

| ID | Sev | Lens | Problem | Evidence | Fix |
|----|-----|------|---------|----------|-----|
| **S-01** | P0 | blocker-for-prod | RMQ published + `guest`/`guest`; MS trust payload | `docker-compose.yml:rabbitmq`; comments/admin handlers | Prod: internal network; strong creds; no host publish |
| **S-02** | P0 | blocker-for-prod | MS HTTP side-doors (`/roles`, CORS `true`, ports 3001/3002) | `auth-users/main.ts`, `roles.controller` | HTTP только health / закрыть порты |
| **S-03** | P0 | blocker-for-prod | `/health` всегда HTTP 200 `status:"ok"` при dead MS | `app.controller.ts:health` | Liveness vs readiness; 503 если users+films down |
| **S-04** | P1 | blocker-for-prod | Нет `timeout()` на `RmqService.send*` | `rmq.service.ts` | `rxjs.timeout(N)` + конфиг; ADR |
| **S-05** | P1 | blocker-for-prod | `fromRpc` только admin/prefs; каталог/auth/comments → 500 | `rpcError.helper.ts` | Обернуть все RMQ-await; auth → statusCode |
| **S-06** | P1 | blocker-for-prod | Filter leak: `HttpException.message`; не `getResponse()` | `global-exception.filter.ts` | Hide ≥500 in prod; normalize getResponse() |
| **S-07** | P1 | blocker-for-prod | Swagger `/api/docs` всегда on | `main.ts` | `SWAGGER_ENABLED` / non-prod |
| **S-08** | P1 | debt-ok-for-mvp | Throttler inert вне AuthController | `app.module` | `APP_GUARD` ThrottlerGuard |
| **S-09** | P1 | blocker-for-prod | Dockerfile HEALTHCHECK `${PORT}` без ENV | `apps/*/Dockerfile` | `ENV PORT=…` |
| **S-10** | P1 | debt-ok-for-mvp | Gateway `depends_on` только rabbit | `docker-compose.yml` | depends_on MS **или** readiness S-03 |

---

## Часть 3. Архитектура и границы (BFF)

**Канон:** `Client → api-gateway (HTTP) → RabbitMQ RPC → auth-users | kino-db → PG → Mapper → Response`

### Соблюдено

- Gateway ↛ Postgres; MS ↛ MS; клиент ↛ MS.
- Admin на gateway: Jwt + RolesGuard + `@Roles("ADMIN")` → thin Service → Admin*Client (ADR-007).
- Prefs write: film-validate на gateway → auth-users (ADR-008) — **ok-BFF**.
- Comments authorName hydrate на gateway — **ok-BFF** (не переносить users в kino-db).

### Orchestration classify

| Место | Класс | Действие |
|-------|-------|----------|
| Comments create (getUser + createComment) | ok-BFF | Fix layer: через AuthClient; authorName = `user.name` |
| Filters ×3 (genres+countries+years) | should-be-cached (+ later should-move-to-MS) | TTL-кэш → опц. `getFiltersBundle` |
| Search ×2 | ok-BFF | Partial failure via `allSettled` |
| Prefs film-check | ok-BFF | Опц. лёгкий `filmExists` RPC |
| Health films+persons ping | fix | Оба = `health.ping` на `FILMS_QUEUE` — оставить один |

### Layering smells

- `CommentsService` / `UserRolesService` → прямой `RmqService`, минуя `*Client`.
- Мёртвый `UserRolesModule` (service живёт в `JwtConfigModule`).

**Sync RMQ = distributed monolith:** confirmed, для MVP `debt-ok-for-mvp`. Timeout — blocker до prod.

---

## Часть 4. RMQ / контракты

### Coverage

- Pattern ∈ contract ↔ gateway client ↔ `@MessagePattern`: **полная**, 0 orphans.
- `favorites.remove` — **internal** (orphan cleanup при 404 фильма), не dead, нет HTTP — by design.
- `getAllFilmYears` — только FiltersClient (fan-out).

### Resilience (факт)

| Тема | Статус |
|------|--------|
| Timeout | **нет** (`firstValueFrom` без `timeout`) |
| Retry / DLQ / prefetch | **нет** (только durable) |
| Correlation / x-request-id | только Nest reply correlation |
| Error wire | Admin/prefs: `RpcException({statusCode})` + `fromRpc`; catalog/auth/comments: legacy `HttpException` / phrase-match → часто HTTP 500 |
| RolesGuard catch | infra error → ложный 403 |

### Fan-out (HTTP → N RMQ)

| HTTP | ≈ RMQ |
|------|-------|
| GET `/health` | 3 (users + films + persons≡films) |
| GET `/filters` | 3 |
| GET `/search` | 2 |
| POST comments | 2+ |
| Prefs write | 2 |
| Admin + RolesGuard | +1 getUserById |

---

## Часть 5. Реализация gateway

### Bootstrap / auth / shared

- ValidationPipe whitelist+transform; нет `forbidNonWhitelisted`.
- Encoding middleware всегда ставит `Content-Type: application/json` (ломает Swagger HTML).
- Auth: throttle login/reg/refresh ок; phrase-match ошибок vs `fromRpc`.
- Deprecated `GET /auth/checkToken` жив.
- Dead: `toAuthResponse`, `ServiceError`, `UserRolesModule`.

### Catalog / BFF

- Контроллеры тонкие; `any` нет.
- Guard wiring неоднороден: persons/genres/countries без Jwt; films/search Jwt+`@Public`; filters `@Public` без class Jwt (= noop).
- Search/filters: `Promise.all` = fail-all.
- Swagger `CountryResponseDto` врёт (`id`/`name` ≠ `countryName`/`countryNameEn`).

### Comments / prefs / admin

- Prefs: film-check + orphan cleanup + `fromRpc` + Jest — ок.
- Comments: нет film-check, нет `fromRpc`, слабый `CommentDTO`, authorName = email local-part.
- Admin: thin passthrough — ок.

---

## Часть 6. apps/common types / DTO

**Оценка: 8/10**

- Barrel: только request+response — ок.
- Response через Pick/Omit; Date в response = string (сэмпл OK).
- **Долг:** три схемы пагинации request (`perPage` / `limit` / `limit+offset`); gateway DTO без `implements T*`; auth request-типы живут в class DTO; RPC refresh/logout request в папке `response/`.

---

## Часть 7. Безопасность

### Зрело (ADR-001)

- Access verify-only на gateway; opaque refresh HttpOnly + rotation/reuse; OriginGuard на refresh/logout в prod; SameSite=lax; throttle login/reg.

### Блокеры prod

- S-01 / S-02 (сеть/брокер/side-doors).
- S-06 filter leak; S-07 Swagger; S-08 throttle только auth.
- RMQ payload: prefs assert id shape; comments/admin — trust gateway (defense-in-depth слабый).

### Не security-дыры

- Public GET catalog без Jwt — ок для B2C (задокументировать).
- `has_session` non-HttpOnly — UX-only (ADR-001), не authz.
- Baseline «RolesGuard мёртв» — **invalid**.

---

## Часть 8. Tests & ops

| Тема | Факт |
|------|------|
| Gateway specs | 6 файлов: films (частично), favorites, ratings, adminFilms, admin RBAC |
| Нет specs | auth, comments, search, filters, persons/genres/countries, guards, health |
| `/health` | всегда 200 `ok` → compose `curl -f` зелёный при dead MS |
| Dockerfile | `${PORT}` без `ENV PORT` |
| Compose | gateway depends_on только rabbit; `JWT_ACCESS_EXPIRES_IN` на gateway не читается |
| auth-users `/health` | без DB check (kino-db — с authenticate) |
| Env | RMQ fail-fast; JWT secret fail только в production |

---

## Часть 9. Decision answers

1. **Filters:** TTL-кэш на gateway first → при необходимости ADR `getFiltersBundle` в kino-db.  
2. **authorName:** оставить на gateway; `user.name` first.  
3. **RolesGuard:** оставить RPC (revoke); опц. TTL-кэш 30–60s.  
4. **Sync-RMQ:** ок для MVP; **timeout ADR обязателен** до внешнего prod; DLQ — backlog.

---

## Часть 10. Roadmap

### Quick wins (≤1d)

1. `rxjs.timeout` в `RmqService` (S-04)  
2. Health readiness + один ping/queue (S-03)  
3. `fromRpc` на comments/auth/catalog (S-05)  
4. GlobalExceptionFilter fix (S-06)  
5. `SWAGGER_ENABLED` (S-07)  
6. CountryResponseDto demote/fix  
7. authorName = `user.name`  
8. Dead code cleanup (см. план в temp)  
9. Dockerfile `ENV PORT` (S-09)

### Structural (ADR)

1. Prod overlay: no publish RMQ/MS (S-01/S-02)  
2. Filters cache / bundle RPC  
3. Единый `RpcException({statusCode})` во всех MS; убрать phrase-match  
4. Pagination → `page`/`perPage`  
5. APP_GUARD Throttler  
6. **Фаза 2 Data Audit** (ниже)

---

## Часть 11. Фаза 2 — Data & Persistence (из среза 19.07, не пересчитано)

Не входил в Gateway & Integration Audit 02.08. Долг актуален до отдельного аудита:

| Тема | Проблема |
|------|----------|
| Schema | `synchronize: true` в auth-users и kino-db |
| Search | `ILIKE %…%` без индексов |
| FilmsService | god-object / тяжёлые join |
| N+1 / likes | comments likesCount scan |
| Role.description | тип vs колонка drift |
| Migrations | отсутствуют |

---

## Часть 12. Delta к срезу 19.07

| Claim 19.07 | Status 02.08 |
|-------------|--------------|
| NestJS 9 | **invalid** → Nest 11 |
| RolesGuard мёртв / admin нет | **fixed** |
| Sync RMQ / no timeout / filters×3 / RMQ trust | **confirmed** |
| Typed contracts | **confirmed** (лучше: 0 orphans) |
| `@common/types` сильный | **confirmed** |
| Auth refresh | **confirmed** |
| synchronize / ILIKE / Films god | **out of scope** → фаза 2 |
| Пагинация drift | **confirmed** |

---

## Часть 13. Ссылки

- Бэклог: [`.cursor/temp/backlog.md`](./backlog.md) (dead-code Wave 1–3 → **B32** closed)  
- Канон: [`.cursor/architecture.md`](../architecture.md), [`.cursor/context/microservices.md`](../context/microservices.md), ADR-001/007/008
