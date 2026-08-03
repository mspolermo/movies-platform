# Единый бэклог (FE / BE / Infra)

Канон архитектуры: [`.cursor/architecture.md`](../architecture.md). Канон клиента: `apps/client`.  
Аудит FE: [`IMPORTANT - frontend-architecture-audit.md`](./IMPORTANT%20-%20frontend-architecture-audit.md) (2026-07-31).  
Аудит BE: [`IMPORTANT - backend-architecture-audit.md`](./IMPORTANT%20-%20backend-architecture-audit.md) (2026-08-02).  
Аудит Infra: [`IMPORTANT - infrastructure-audit.md`](./IMPORTANT%20-%20infrastructure-audit.md) (2026-08-02).  
Dead code: [`dead-code-cleanup-plan.md`](./dead-code-cleanup-plan.md) (D1–D13 → **B32**).

Актуализировать при закрытии пунктов; не дублировать в `architecture.md`.  
**Обновлено:** 2026-08-02 — ревью: дедуп FE↔BE↔Infra, единый владелец, порядок волн по зависимостям.

## Легенда

| Priority | Смысл |
|----------|--------|
| **P0** | Критичный риск / продуктовый контракт |
| **P1** | Архитектура, UX, важные улучшения |
| **P2** | DX / polish / низкий ROI |
| **Skip** | Не делать |

Горизонт: **S** краткосрочно · **M** средне · **L** долгосрочно.

### Правила владельца (анти-дубль)

1. Работаем **один раз** — пункт живёт в таблице своего слоя (`F*` / `B*` / `I*`).
2. Пересечения BE↔Infra → матрица ниже + колонка «Связь»; в Infra **нет** строк-указателей «→ B22».
3. Dead-code D1–D13 только через **B32** (не плодить B7/B35 как отдельные задачи).
4. LIST enrich профиля: продукт **F28**, BE-часть **B13** — закрывать одним треком.

---

## Frontend — активный

ID `F-xx-yy` = findings аудита. `#` = трек бэклога.

### P0 — session / correctness

| # | Что | ID | Горизонт | Как |
|---|-----|-----|:--------:|-----|
| F20 | Cross-tab refresh lock | F-03-01 | **M** | BroadcastChannel / `navigator.locks` до второго `/auth/refresh`; иначе BE reuse → revoke-all |
| F21 | Prefs cache invalidation | F-04-01 | **M** | focus/visibility refetch compact ids/grades; не держать Set/Map как вечный SoT |
| F22 | API fail ≠ `notFound()` | F-06-01 | **S** | `getFilmsFilters` / `fetchAllProfessionsData`: error UI / `error.tsx`, не `notFound()` на 500 |
| F23 | Client fetch: error state | F-06-02 | **S** | search / creators / personSearch — не глотать в `[]` |
| F24 | Header «Разделы» absolute URL | F-10-01 | **S** | `url: '/professions'` (+ аудит остальных relative) |

### P1 — state / ADR-008 / catalog / perf

| # | Что | ID | Горизонт | Как |
|---|-----|-----|:--------:|-----|
| F25 | Prefs context per-id / split | F-07-01 | **M** | селекторы / split favorite vs rating — без O(n) всех панелей |
| F26 | Route-scoped film prefs providers | F-15-01 | **M** | не монтировать Favorite+Actions на `/auth/*` (и холодных routes) |
| F27 | Profile LIST prefs UI | F-12-01 | **M** | секции избранного/оценок; `getMyFavorites` / `getMyFilmRatings` |
| F28 | LIST enrich (film cards) | F-12-02 | **L** | вместе с **B13**: gateway/kino-db enrich или batched film fetch |
| F29 | Filters: один URL writer | F-08-01 | **L** | убрать dual mirror + quick-filters 2nd writer |
| F30 | `/films` RSC `initialData` | F-08-02 | **M** | page-1 с сервера в `usePaginatedResource` |
| F31 | RSC `Page` shell | F-15-05 | **M** | BackButton island; убрать `'use client'` с chrome (~25 pages) |
| F32 | FilmDetail split client | F-15-04 | **L** | RSC shell + islands; loading не тянуть полный page module |
| F33 | Route `loading.tsx` parity | F-06-03 | **S** | home, search, profile, auth, admin |
| F34 | Card actions a11y | F-16-01..05 | **M** | focus-within/touch; не `article[role=button]`+nested; KB; visible errors |
| F35 | PersonDetail SCSS decoupling | F-01-02 | **S** | tokens/props API, не import entity `.module.scss` |
| F36 | Admin dashboard copy | F-09-01 | **S** | убрать «заглушка / HTTP не идёт» после ADR-007 |
| F37 | IPTV out of prod nav | F-11-04 | **S** | спрятать `/tv` или ADR+backend SoT |

### P2 — DX / kit / styles

| # | Что | ID | Горизонт | Как |
|---|-----|-----|:--------:|-----|
| F38 | Domain unit tests | F-05-01 | **M** | FavoriteProvider hydrate/toggle; filter parse/serialize |
| F39 | filterFilms slim | F-08-03 | **L** | схлопнуть L/T/M SCSS forks где diff = CSS |
| F40 | Font SoT | F-13-01 | **S** | Inter **или** IvySans — не оба |
| F41 | Breakpoints canon | F-13-02 | **M** | только `$bp-mobile`/`$bp-tablet` (650/1160) |
| F42 | Kit: Card / domain composites | F-14-01/02 | **M** | Card→PersonCard; SortFilter/AdminCrudList не в generic root |
| F43 | Rename `get*` features | F-01-01 | **L** | rename done (`browse*`/`commentOnFilm`/…); over-slices → Layout/shared — open |
| F13 | i18n | — | **L** | next-intl / аналог |
| F16 | E2E Playwright | — | **L** | только с ADR; login→profile→logout |

### Skip

| # | Что | Почему |
|---|-----|--------|
| F2 | OAuth Google/VK | [ADR-006](../adr/006-no-oauth.md) |
| — | Nested comments | [ADR-002](../adr/002-flat-film-reviews.md) |
| — | React Query / E2E без ADR | канон PROJECT_CONTEXT |

---

## Backend — активный

ID `S-xx` = synth findings. Dead code → **B32** / [план D1–D13](./dead-code-cleanup-plan.md).

### P0 — prod blockers

| # | Что | ID | Горизонт | Связь | Как |
|---|-----|-----|:--------:|-------|-----|
| B20 | RMQ published + guest; MS trust payload | S-01 | **S** | **I7**, I14 | Prod overlay: не publish 5672/15672; сильные креды; internal net |
| B21 | MS HTTP side-doors (`/roles`, CORS, ports) | S-02 | **S** | **I7** | HTTP только `/health` или закрыть порты; CORS off |
| B22 | Gateway `/health` всегда 200 `ok` | S-03 | **S** | I2, B29, B40 | Liveness vs readiness; 503 если users+films down; один ping/queue |

### P1 — resilience / errors / ops

| # | Что | ID | Горизонт | Связь | Как |
|---|-----|-----|:--------:|-------|-----|
| B23 | RMQ RPC timeout (+ ADR) | S-04 | **S–M** | — | `rxjs.timeout` в `RmqService`; ADR; DLQ/prefetch следом |
| B24 | `fromRpc` на catalog/auth/comments | S-05 | **S** | B31, B41 | Все RMQ-await через `fromRpc`; auth statusCode вместо phrase-match |
| B25 | GlobalExceptionFilter leak / getResponse | S-06 | **S** | — | Hide ≥500 in prod; normalize `getResponse()` |
| B26 | Swagger gate | S-07 | **S** | I16 | `SWAGGER_ENABLED` / non-prod only |
| B27 | Global ThrottlerGuard | S-08 | **M** | — | `APP_GUARD`; жёстче admin/write |
| B28 | Dockerfile `ENV PORT` | S-09 | **S** | I12 | Все три Dockerfile (HC `${PORT}`) |
| B29 | Compose gateway depends_on MS | S-10 | **S** | B22, I2 | `service_healthy` MS **или** достаточно readiness B22 |
| B1 | `synchronize: true` → migrations | INF-53 | **S** | I8 | auth-users + kino-db; sync off @edge |
| B30 | Filters TTL-кэш / bundle RPC | A1-04 | **M** | — | Кэш на gateway; опц. ADR `getFiltersBundle` |
| B31 | Единый RpcException во всех MS | A2-04 | **M** | B24 | Канон `{statusCode,message}`; выкинуть phrase-match |
| B13 | LIST prefs enrich для профиля | F-12-02 | **L** | **F28** | gateway/kino-db enrich под карточки профиля |

### P2 — quality / DX

| # | Что | ID | Горизонт | Связь | Как |
|---|-----|-----|:--------:|-------|-----|
| B32 | Dead code Wave 1–3 | D1–D13 | **S** | — | [dead-code-cleanup-plan.md](./dead-code-cleanup-plan.md); включает checkToken, CountryDto, ApiParam |
| B33 | authorName = `user.name` | A3c-03 | **S** | — | fallback email local-part |
| B34 | Comments film-check + fromRpc | A3c-01/02 | **S** | B24 | как prefs или RpcException 404 в kino-db |
| B36 | Pagination request unify | A4-01 | **M** | — | канон `page`/`perPage` |
| B37 | Search/filters partial failure | A3b-03/04 | **M** | — | `allSettled` + partial payload |
| B38 | Guard wiring catalog unify | A3b-05 | **M** | B32/D9 | Jwt+`@Public` везде **или** явно без Jwt |
| B39 | Gateway Jest gaps | A6-06 | **M** | — | auth, comments, health, filters |
| B40 | Auth-users `/health` + DB | A6-05 | **S** | B22 | как kino-db `authenticate` |
| B41 | RolesGuard: не маскировать infra→403 | A2-07 | **S** | B24 | fromRpc + проброс 5xx |
| B42 | Comments через AuthClient | A1-02 | **S** | — | не прямой `RmqService` |
| B15 | Observability (x-request-id) | A2-10 | **M** | — | correlation HTTP↔RMQ |
| B10 | Event-driven write-side | — | **L** | — | только с ADR |

### Skip / не делать сейчас

| # | Что | Почему |
|---|-----|--------|
| — | Roles в access JWT only | Synth: оставить RPC revoke (ADR-007) |
| — | Удалить `favorites.remove` | Internal orphan-cleanup |
| — | Перенос authorName в kino-db | ok-BFF |
| B2 | `has_session` HttpOnly | UX-хинт; не security (ADR-001) |

---

## Infra — активный

Источник: [infrastructure-audit.md](./IMPORTANT%20-%20infrastructure-audit.md). Score ~3.5/10 (edge ~2).  
Код/поведение health, swagger, migrations, side-doors — **в Backend**; здесь compose/images/CI/docs.

### P0 — edge / orchestrator

| # | Что | ID | Горизонт | Связь | Как |
|---|-----|-----|:--------:|-------|-----|
| I7 | Prod overlay: strip publish / no bind / production target | INF-85/70/71 | **S** | **B20**, **B21** | `compose.prod.yml` (или override); internal data plane |
| I8 | Named volumes PG×2 + RMQ | INF-51 | **S** | B1, I9, I17 | `pg_kino` / `pg_users` / `rmq_data`; lifecycle в docs |
| I14 | Weak defaults: PG `root/root`; RMQ guest вне env | INF-40 | **S** | **B20** | Strong secrets; RMQ user/pass из env; example ≠ prod-like |

### P1 — DX compose / images / secrets / CI

| # | Что | ID | Горизонт | Связь | Как |
|---|-----|-----|:--------:|-------|-----|
| I2 | Убрать `sleep 15`; `start_period` + healthy | INF-01 | **S** | B22, B29 | HC на readiness |
| I3 | Graceful workers + `init` + `stop_grace_period` | INF-86/87 | **S** | — | `app.close()`; compose `init: true` |
| I4 | GitHub Actions merge gate (root + client) | INF-80/81 | **S–M** | I18, I22 | lint / typecheck / test / `nest build`×3 / next build |
| I9 | Backup/restore runbook (`pg_dump`) | INF-57 | **S** | I8 | после named volumes |
| I10 | Fix `start:prod` → `dist/apps/<app>/main` | INF-20 | **S** | — | script или удалить ложь |
| I11 | `.dockerignore`: client, `.cursor`, seed data | INF-12 | **S** | I20 | shrink build context |
| I12 | Non-root USER в Dockerfile ×3 | INF-10 | **S** | B28 | + chown dist |
| I13 | Compose `profiles: [tools]` / `[seed]` | INF-04/41 | **S** | I7 | pgadmin/seed opt-in |
| I15 | Seed `depends_on kino-db: service_healthy` | INF-02 | **S** | — | + schema poll в script |
| I16 | Env hardening: JWT placeholder / CORS / pgadmin→env | INF-42/44/41 | **S** | B26 | fail-fast; `STRICT_ORIGINS` или always allowlist |
| I17 | Doc blast radius `down -v` (kino≠all) | INF-56 | **S** | I8 | deployment.md per-volume |
| I18 | SHA-tag ship GW+MS | INF-91 | **M** | I4 | GHCR `:gitsha`; после CI |

### P2 — polish / later

| # | Что | ID | Горизонт | Связь | Как |
|---|-----|-----|:--------:|-----|
| I1 | Client в compose (optional profile) | INF-60 | **S–M** | — | `profiles: [web]` **или** оставить host-Next |
| I6 | Dual lockfile / workspaces | — | **L** | I4 | npm workspaces **или** policy sync + audit×2 в CI |
| I19 | Pin image digests | INF-08/14 | **S** | — | postgres/rmq/node/pgadmin |
| I20 | Slim prod image: no `COPY .` source; fix double `npm ci` | INF-11/13/15 | **M** | I11 | deps+dist only |
| I21 | Resource limits + log rotate driver | INF-88/89 | **S** | I7 | overlay |
| I22 | Dependabot + `npm audit` в CI | INF-83 | **S** | I4 | после merge gate |
| I23 | Dual bootstrap kino-seed vs users-initdb | INF-52/59 | **M** | — | runbook или единый seed job |
| I24 | Default admin password в SQL comment | INF-58 | **S** | — | local-only; rotate @edge |
| I25 | Dead `libs/**` in format; Jest ignore client; engines | INF-21/22/24 | **S** | — | package.json cleanup |

### Skip / владельцы в BE · не сейчас

| # | Что | Почему |
|---|-----|--------|
| — | RMQ/MS publish detail, readiness, migrations, swagger, ENV PORT, GW depends_on, auth-users health | **B20–B22, B1, B26, B28, B29, B40** |
| — | k8s/helm | INF-93 — compose = ceiling до ADR |
| — | Mac bind virtiofs | INF-90 — P2 nit при боли DX |
| — | Internal net / TLS / bind@edge как отдельные тикеты | часть **I7** overlay |

---

## Пересечения (владелец один)

| Тема | Владелец | Поддержка |
|------|----------|-----------|
| Не publish RMQ/MS/DB + guest | **B20/B21** + **I7** | I14 secrets |
| Readiness / false-green HC | **B22** | I2 start_period; B29; B40 |
| `ENV PORT` / non-root image | **B28** / **I12** | один PR образов OK |
| Swagger off @edge | **B26** | I16 |
| Migrations / sync off | **B1** | I8 volumes |
| Profile LIST cards | **F28** + **B13** | F27 UI |
| Dead code / checkToken / CountryDto | **B32** | — |

---

## Рекомендуемый порядок

Принцип: **edge-блокер → cold-start/health → RPC resilience → параллельно FE P0 + cheap cleanup → CI/images → migrations → prefs/product → polish.**  
FE P0 (F22–F24, F20) не ждать миграций/CI — независимы.

```
В0  Edge surface
    I7 + B20 + B21 · I8 · I14 · B22 · B28 · I12
    (один трек: overlay + secrets + readiness + PORT/non-root)

В1  Compose cold-start / DX
    I2 · I3 · I13 · I15 · I17 · B29 · B40

В2  RPC / HTTP resilience
    B23 · B24 · B25 · B26 · B41 · B42
    (+ B33/B34 comments рядом с fromRpc)

В3  Параллельные быстрые wins
    FE: F22 · F23 · F24 · F36 · F37 · F20
    BE: B32 (D1–D9; D10–D13 с В2)
    Infra: I10 · I11 · I16

В4  Prefs correctness (FE)
    F21 · F25 · F26

В5  CI + ops
    I4 · I9 · I18 · I22

В6  Schema
    B1 (migrations; sync off @edge) — после I8, не мешать В0–В2

В7  Profile LIST
    F27 · F28 + B13

В8  Catalog / RSC / a11y
    F29–F35 · F33

В9  Later polish
    B27 · B30 · B31 · B36–B39 · B15 · B10
    I1 · I6 · I19–I21 · I23–I25
    F38–F43 · F13 · F16
```

Почему сдвиг vs предыдущего порядка:
- FE correctness (ошибки/nav/refresh) вынесен в **В3**, не после CI/migrations.
- Migrations (**B1**) отдельной волной **после** edge+resilience — риск данных не блокирует health/RPC.
- Dead-code (**B32**) рано, но не в P0-треке.
- Comments/fromRpc/RolesGuard сгруппированы в **В2** (один смысловой PR-кластер).
- CI (**I4**) после того, как HC/scripts не врут (иначе gate зелёный на лжи).

---

## Чеклист (только open)

### Frontend
- [ ] F20 multi-tab refresh lock
- [ ] F21 prefs invalidation
- [ ] F22/F23 error ≠ empty/404
- [ ] F24 header absolute URLs
- [ ] F25/F26 prefs context + provider scope
- [ ] F27/F28 profile LIST (+ B13 enrich)
- [ ] F29–F33 catalog URL / seed / Page RSC / detail / loadings
- [ ] F34 a11y actions surfaces
- [ ] F35–F37 PersonDetail SCSS / admin copy / IPTV nav
- [ ] F38–F43 DX kit/styles/rename
- [ ] F13 i18n · F16 E2E (с ADR)

### Backend
- [ ] B20/B21/B22 P0 (RMQ / side-doors / health)
- [ ] B23–B29 + B40/B41/B42 resilience/ops/layering
- [ ] B32 dead-code · B33/B34 comments · B1 migrations
- [ ] B30/B31 filters + RpcException · B13 LIST enrich
- [ ] B36–B39 · B15 · B27 · B10

### Infra
- [ ] I7/I8/I14 overlay + named vols + weak defaults
- [ ] I2/I3/I13/I15/I17 compose DX + graceful + profiles + seed + docs
- [ ] I4 CI · I9 backup · I10–I12 images/scripts · I16 env
- [ ] I1/I6/I18–I25 polish

---

## Архив (закрыто)

### Frontend

| # | Что | Закрыто |
|---|-----|---------|
| F1 | Admin CRUD B2C | ADR-005 + ADR-007 |
| F3 / F4 | Favorites + ratings compact | ADR-008 |
| F5 | Access token in-memory | ADR-001 |
| F6 / F8 | Share + player panel actions | ADR-004 + ADR-008 |
| F12 | Promo / hero | ADR-003 |
| F14 / F15 | Vitest + Storybook kit baseline | partial |
| F17 | Удалить `old-client/` | done |
| — | Pagination dupes / fake favorite UI | done |

### Backend

| # | Что |
|---|-----|
| B5 / B6 | RolesGuard `/admin/*` + orphan `createRole` удалён (ADR-007) |
| B11 / B12 | Ratings + favorites RPC (ADR-008) |
| B4 | «Два HTTP-порта у МС» → переформулирован в **B21** |
| B8 | checkToken → **B32/D7** |
