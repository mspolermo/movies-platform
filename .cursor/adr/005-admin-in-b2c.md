# 005. Admin в B2C (`/admin/*`) — FE stubs + контракт BE

- **Статус:** Accepted
- **Дата:** 2026-07-28
- **Участники:** —

> **BE реализован, FE снят со стабов — см. [ADR-007](./007-admin-be-implementation.md).** Разделы про stubs ниже — исторический контекст; отклонение от контракта: все admin-списки пагинированы (`TPaginatedItemsResponse`), не plain-массивы.

## Контекст

Нужен бэк-офис в том же Next-приложении (`apps/client`): CRUD фильмов (скаляры), справочников, персон, пользователей/ролей. Backend write/RBAC ещё не готов (RolesGuard мёртв — B5). OLD-админка (BEM/Redux/localStorage JWT) не переносится.

## Решение

### Scope сейчас (FE)

| Делаем | Не делаем сейчас |
|--------|------------------|
| Multi-page `/admin/*`, FSD, stubs + fixtures | Gateway `/admin`, RPC write, RolesGuard wiring |
| Forward types + `API_ENDPOINTS.ADMIN` | `apiClient` на admin stubs |
| Seed `admin@gmail.com` в `devops/users-db` | Film M:N (жанры/страны/каст), i18n, E2E |

### FE IA

```
Layout (Header+Footer)
  └─ AdminRootLayout (gate: loading → login → soft-404 = NotFoundPage UI)
       └─ AdminLayout (sidebar shell)
            └─ Admin*Page → Page(titleAlign=start) + manage*
```

| Инвариант | Деталь |
|-----------|--------|
| Routes | `/admin`, `/admin/films[/new\|/:id]`, genres, countries, professions, persons, users |
| AdminRootLayout | pages: auth/role gate; soft-404 = `Page` + `NotFoundView` (тот же UI, что `NotFoundPage`) |
| AdminLayout | shell only (nav + children), **0 features** |
| Pages | flat slices `AdminFilmsPage`, … |
| Features | `manageFilms` / `manageGenres` / … / `manageUsers`; **per-feature** module-scope stub store |
| Breadcrumbs | **нет** в admin (sidebar + `Page` title достаточно) |
| Site chrome | Header + Footer **как у сайта** |
| Non-ADMIN | soft-404 → UI `NotFoundPage` (`shared/ui/NotFoundView`; не `notFound()` из Client Component) |
| Post-login USER→`/admin*` | soft-404 (без bounce) |
| Gate order | loading → login (`returnUrl`) → soft-404 |
| Nav | Header «Разделы»: публичные главы + блок «Администрирование» (**только ADMIN**); **ProfileSection** тоже Admin; MobileFooter — нет; Debug → ProfileSection non-prod |
| Films | CRUD **скаляров** через `@common/types` request/response; даты — ISO `string` |
| Persons | `professionIds` + page composition для profession options |
| Users | stub list + смена роли `ADMIN \| USER \| MANAGER` (last-ADMIN guard — **только BE**, см. ниже) |
| HTTP | stubs **не** вызывают `apiClient` |
| Цвета | токены `colors.scss` |

### Credentials (local only)

| | |
|--|--|
| Email | `admin@gmail.com` |
| Password | `Ms123456` |
| Name | `Admin` |
| Role | `ADMIN` |

bcrypt rounds = 10. Dump: роль `MANAGER` + user + `user_roles` + `setval` sequences после COPY. Fresh volume / `docker compose down -v`.

### Out of scope сейчас: реализация BE / B5

Код gateway/RPC/RolesGuard **не** в этой задаче. Ниже — целевой контракт для follow-up.

## FE → BE: какие stubs менять и какие эндпойнты

Consts уже в `apps/client/src/shared/api/endpoints.ts` → `API_ENDPOINTS.ADMIN.*`.  
Follow-up на клиенте: **только тела** функций в `features/manage*/api/*StubApi.ts` → `apiClient` (GET/POST/PATCH/DELETE). UI/`useSyncExternalStore` не трогать (после ответа API — обновить snapshot или заменить store на refetch).

Типы тел/ответов: `@common/types` (`request/admin`, `response/admin`).

### `manageFilms` — `features/manageFilms/api/filmsStubApi.ts`

| Stub | HTTP | Path | `API_ENDPOINTS` |
|------|------|------|-----------------|
| `listFilmsStub` | `GET` | `/admin/films` (?q= optional) | `ADMIN.FILMS.LIST` |
| `getFilmByIdStub` | `GET` | `/admin/films/:id` | `ADMIN.FILMS.BY_ID(id)` |
| `createFilmStub` | `POST` | `/admin/films` | `ADMIN.FILMS.LIST` |
| `updateFilmStub` | `PATCH` | `/admin/films/:id` | `ADMIN.FILMS.BY_ID(id)` |
| `deleteFilmStub` | `DELETE` | `/admin/films/:id` | `ADMIN.FILMS.BY_ID(id)` |

Body create/update: `TCreateFilmRequest` / `TUpdateFilmRequest`. Ответ item: `TAdminFilmItemResponse`.

### `manageGenres` — `features/manageGenres/api/genresStubApi.ts`

Сейчас list = `getGenresSnapshot` (in-memory). При проводке: добавить/использовать **GET list** (имя функции — `listGenresStub` или hydrate snapshot из GET).

| Stub (сейчас / цель) | HTTP | Path | `API_ENDPOINTS` |
|---------------------|------|------|-----------------|
| snapshot / list | `GET` | `/admin/genres` | `ADMIN.GENRES.LIST` |
| `createGenreStub` | `POST` | `/admin/genres` | `ADMIN.GENRES.LIST` |
| `updateGenreStub` | `PATCH` | `/admin/genres/:id` | `ADMIN.GENRES.BY_ID(id)` |
| `deleteGenreStub` | `DELETE` | `/admin/genres/:id` | `ADMIN.GENRES.BY_ID(id)` |

Body: `TCreateGenreRequest` / `TUpdateGenreRequest`. List/item: `TAdminGenreItemResponse` (**с `id`**).

### `manageCountries` — `features/manageCountries/api/countriesStubApi.ts`

| Stub (сейчас / цель) | HTTP | Path | `API_ENDPOINTS` |
|---------------------|------|------|-----------------|
| snapshot / list | `GET` | `/admin/countries` | `ADMIN.COUNTRIES.LIST` |
| `createCountryStub` | `POST` | `/admin/countries` | `ADMIN.COUNTRIES.LIST` |
| `updateCountryStub` | `PATCH` | `/admin/countries/:id` | `ADMIN.COUNTRIES.BY_ID(id)` |
| `deleteCountryStub` | `DELETE` | `/admin/countries/:id` | `ADMIN.COUNTRIES.BY_ID(id)` |

Body: `TCreateCountryRequest` / `TUpdateCountryRequest`. Item: `TAdminCountryItemResponse` (**с `id`**).

### `manageProfessions` — `features/manageProfessions/api/professionsStubApi.ts`

| Stub (сейчас / цель) | HTTP | Path | `API_ENDPOINTS` |
|---------------------|------|------|-----------------|
| snapshot / list | `GET` | `/admin/professions` | `ADMIN.PROFESSIONS.LIST` |
| `createProfessionStub` | `POST` | `/admin/professions` | `ADMIN.PROFESSIONS.LIST` |
| `updateProfessionStub` | `PATCH` | `/admin/professions/:id` | `ADMIN.PROFESSIONS.BY_ID(id)` |
| `deleteProfessionStub` | `DELETE` | `/admin/professions/:id` | `ADMIN.PROFESSIONS.BY_ID(id)` |

Body: `TCreateProfessionRequest` / `TUpdateProfessionRequest`. Item: `TAdminProfessionItemResponse`.

### `managePersons` — `features/managePersons/api/personsStubApi.ts`

| Stub (сейчас / цель) | HTTP | Path | `API_ENDPOINTS` |
|---------------------|------|------|-----------------|
| snapshot / list | `GET` | `/admin/persons` (?q= optional) | `ADMIN.PERSONS.LIST` |
| (опц. get one) | `GET` | `/admin/persons/:id` | `ADMIN.PERSONS.BY_ID(id)` |
| `createPersonStub` | `POST` | `/admin/persons` | `ADMIN.PERSONS.LIST` |
| `updatePersonStub` | `PATCH` | `/admin/persons/:id` | `ADMIN.PERSONS.BY_ID(id)` |
| `deletePersonStub` | `DELETE` | `/admin/persons/:id` | `ADMIN.PERSONS.BY_ID(id)` |

Body: `TCreatePersonRequest` / `TUpdatePersonRequest` (+ `professionIds`). Item: `TAdminPersonItemResponse`.  
Professions options на UI: GET `/admin/professions` (тот же list, что `manageProfessions`).

### `manageUsers` — `features/manageUsers/api/usersStubApi.ts`

| Stub (сейчас / цель) | HTTP | Path | `API_ENDPOINTS` |
|---------------------|------|------|-----------------|
| snapshot / list | `GET` | `/admin/users` | `ADMIN.USERS.LIST` |
| `updateUserRoleStub` | `PATCH` | `/admin/users/:id` | `ADMIN.USERS.BY_ID(id)` |

Body PATCH: `TUpdateUserRoleRequest` `{ role: TAppRole }`. List item: `TAdminUserItemResponse`.  
Последний ADMIN → **409/400 на BE** (FE stub не дублирует).

### Не трогать при проводке API

- `subscribe*` / `get*Snapshot` / `useAdmin*` — можно оставить как кэш после fetch, либо упростить до React state + refetch.
- Pages / widgets UI, soft-404 gate; admin без breadcrumbs.
- Публичные `GET /genres`, `GET /countries` (без `id`) — не замена admin list.

## BE: целевой контракт (спецификация)

### HTTP

Префикс `/admin`, Jwt Bearer (access in-memory на клиенте). Сводка методов — таблица выше (stub → HTTP); дублировать пути здесь:

| Resource | Methods | Notes |
|----------|---------|--------|
| `/admin/films` | GET list, POST | search/query optional |
| `/admin/films/:id` | GET, PATCH, DELETE | body = scalar film fields |
| `/admin/genres` | GET, POST | list **с `id`** |
| `/admin/genres/:id` | PATCH, DELETE | |
| `/admin/countries` | GET, POST | list **с `id`** |
| `/admin/countries/:id` | PATCH, DELETE | |
| `/admin/professions` | GET, POST | |
| `/admin/professions/:id` | PATCH, DELETE | |
| `/admin/persons` | GET, POST | + `professionIds` |
| `/admin/persons/:id` | GET?, PATCH, DELETE | sync PersonProfession |
| `/admin/users` | GET list | id, email, name?, roles[] |
| `/admin/users/:id` | PATCH | `{ role: TAppRole }` — одна роль |

Публичные `GET /genres` / `GET /countries` могут остаться без `id`; admin list — отдельные DTO.

### AuthZ

- `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles('ADMIN')` на **все** `/admin/*`.
- `MANAGER` / `USER` → 403 на admin API.
- B5: проводка RolesGuard вместе с admin routes.
- Авторизация по роли `ADMIN`, не только валидный JWT.

### RPC / слои

- **kino-db:** write films/genres/countries/professions/persons (+ PersonProfession). Patterns в `kino-db.rpc.ts`.
- **auth-users:** list users+roles; set single role. Patterns в `auth-users.rpc.ts`.
- Mapper → `T*Response`; ORM наружу не отдавать.
- DTO + ValidationPipe (`@common/dto` admin/*); Swagger `/api/docs`.

### Film write F1 BE

- Только скаляры entity; **не** film↔genre/country/person cast.
- `TFilmCreationAtt` расширить или отдельный admin creation type.

### Delete / integrity

При BE выбрать: **Restrict** (409) vs **Cascade**. FE stub всегда success.

### Users / roles

- Seed: `ADMIN`, `USER`, `MANAGER`.
- Одна активная роль на user (UI select).
- **BE (F1 / auth-users):** нельзя разжаловать последнего ADMIN — инвариант на сервере (PATCH `/admin/users/:id` → 409/400). FE stub этот запрет **не** дублирует.

### Прочее BE

- Genre rename vs client filters by `nameRu` — риск; long-term filter by id/slug.
- Client follow-up: см. § «FE → BE: какие stubs менять» — только `*StubApi.ts` → `apiClient`.
- Обновить `project-index.md` после появления routes.

## Последствия

- F1 FE: UI готов к проводке API.
- F1 BE + B5 — отдельная задача по этому ADR.
- Soft-404 не даёт HTTP 404 и не security.

## Альтернативы

- Отдельный admin SPA — отклонено (B2C mono).
- REST без `/admin` prefix на публичных ресурсах — отклонено (явный admin surface).
- Hide site Header/Footer — отклонено (оставить chrome).
