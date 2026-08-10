# Проект

B2C Movies Platform — каталог фильмов и людей, фильтры, поиск, комментарии, JWT-auth.  
Монорепа без `packages/`: backend apps + `apps/common` + `apps/client`.

---

# Архитектура

- Паттерн: **API Gateway + 2 микросервиса** (sync RPC через RabbitMQ).
- Клиент не ходит в MS напрямую — только в `api-gateway` (через Next rewrite `/api/*`).
- Две БД: `db` (kino) и `db2` (users) — изоляция auth/content.
- Детали: [architecture.md](./architecture.md), [dependency-graph.md](./dependency-graph.md).

---

# Все сервисы

| Сервис | Роль | Порт | Транспорт | БД |
|--------|------|------|-----------|-----|
| `api-gateway` | HTTP API, JWT verify, cookies, BFF-оркестрация | 5001→5000 | HTTP + RMQ client | — |
| `auth-users` | Users, roles, JWT, refresh, favorites/ratings (ADR-008) | 3001 | HTTP `/health` + RMQ | `db2` |
| `kino-db` | Films, persons, dictionaries, comments | 3002 | HTTP health + RMQ | `db` |
| `rabbitmq` | Очереди `users_queue`, `films_queue` | 5672 / 15672 | AMQP | — |

---

# Все приложения

| App | Путь | Описание |
|-----|------|----------|
| api-gateway | `apps/api-gateway` | Единая HTTP-точка входа |
| auth-users | `apps/auth-users` | Auth / users / roles / user–film prefs |
| kino-db | `apps/kino-db` | Контентный домен |
| client | `apps/client` | Next.js FSD UI |
| common | `apps/common` | Types, DTO, RMQ, constants (Nest lib) |

---

# Все пакеты

Отдельных npm-packages нет.

| Модуль | Путь | Экспорт |
|--------|------|---------|
| Types | `apps/common/types` | Barrel: только `request` + `response` |
| ORM types | `apps/common/types/orm` | Backend-only import |
| Entity types | `apps/common/types/entity` | База для response/orm, не в barrel |
| DTO | `apps/common/dto` | Nest class-validator (backend) |
| RMQ | `apps/common/services/rmq` | `RmqModule`, `RmqService`, `kinoDbRpc`, `authUsersRpc` |
| Constants | `apps/common/constants` | Limits, grade, JWT helpers (BE); network SoT |
| Network | `apps/common/constants/network.ts` (+ `network.rmq.ts`) | Публичные порты/URL; RMQ — `network.rmq`; зеркало `devops/network.env` (ADR-009) |

Алиас: `@common`, `@common/*` → `apps/common`.  
Клиент: types + value-import constants/network; не JWT/dto/orm/entity.

---

# Все публичные API

База: `http://localhost:5001` (Swagger `/api/docs` — только non-prod).  
Клиент: same-origin `/api/*` → rewrite на gateway.

| Метод | Путь | Auth | Назначение |
|-------|------|------|------------|
| GET | `/health` | Public | Readiness (RPC ping users+films + DB; 503 если down) |
| GET | `/health/live` | Public | Liveness (process up) |
| POST | `/auth/registration` | Public | Регистрация + cookies |
| POST | `/auth/login` | Public | Логин + cookies |
| POST | `/auth/refresh` | Public + OriginGuard | Ротация токенов |
| POST | `/auth/logout` | Public + OriginGuard | Revoke + clear cookies |
| GET | `/auth/me` | JWT | Текущий пользователь |
| GET | `/films` | Public | Поиск/фильтры |
| GET | `/films/:id` | Public | Детали фильма |
| GET | `/films/:id/similar` | Public | Похожие |
| GET | `/films/:id/professions` | Public | Профессии в фильме |
| GET | `/films/:id/persons-by-profession` | Public | Каст по профессии |
| GET | `/persons` | Public | Список персон |
| GET | `/persons/search` | Public | Поиск персон |
| GET | `/persons/:id` | Public | Профиль |
| GET | `/persons/:id/filmography` | Public | Фильмография |
| GET | `/genres` | Public | Жанры |
| GET | `/countries` | Public | Страны |
| GET | `/professions` | Public | Профессии |
| GET | `/professions/:professionId/persons` | Public | Персоны по профессии |
| GET | `/filters` | Public | Агрегация фильтров |
| GET | `/filters/quick` | Public | Quick filters (header) |
| GET | `/search` | Public | Глобальный поиск |
| GET | `/comments/:filmId` | Public | Комментарии (optional JWT) |
| POST | `/comments/:filmId` | JWT | Создать комментарий |
| POST | `/comments/:commentId/like` | JWT | Лайк комментария |
| GET | `/favorites` | JWT | Избранное (пагинация) |
| GET | `/favorites/ids` | JWT | Compact filmIds (hydrate панели) |
| POST | `/favorites/:filmId` | JWT | Toggle избранного (validate film) |
| GET | `/ratings` | JWT | Оценки пользователя (пагинация) |
| GET | `/ratings/grades` | JWT | Compact grades (hydrate панели) |
| PUT | `/ratings/:filmId` | JWT | Upsert 1–10; film 404 → orphan delete + 404 |
| DELETE | `/ratings/:filmId` | JWT | Удалить оценку |
| GET/POST | `/admin/films` | ADMIN | Пагинированный список (`?q=`) / создание |
| GET/PATCH/DELETE | `/admin/films/:id` | ADMIN | Скаляры фильма; DELETE — cascade (ADR-007) |
| GET/POST | `/admin/genres` | ADMIN | Пагинация + `?q=` / создание (409 дубликат имени) |
| PATCH/DELETE | `/admin/genres/:id` | ADMIN | DELETE — restrict 409 при привязке |
| GET/POST | `/admin/countries` | ADMIN | Пагинация + `?q=`; аналогично genres |
| PATCH/DELETE | `/admin/countries/:id` | ADMIN | Аналогично genres |
| GET/POST | `/admin/professions` | ADMIN | Пагинация (client search — словарь ~9) |
| PATCH/DELETE | `/admin/professions/:id` | ADMIN | restrict — по персонам |
| GET/POST | `/admin/persons` | ADMIN | Пагинация + `?q=`; `professionIds` |
| GET/PATCH/DELETE | `/admin/persons/:id` | ADMIN | DELETE — restrict 409 если в фильмах |
| GET | `/admin/users` | ADMIN | Пагинированный список с ролями |
| PATCH | `/admin/users/:id` | ADMIN | `{ role }`; последний ADMIN → 409 |

Public = class `JwtAuthGuard` + method `@Public` (optional Bearer; `JwtConfigModule` `@Global`; готовность к `APP_GUARD` / B38).  
JWT = `JwtAuthGuard` без `@Public`.  
ADMIN = `JwtAuthGuard + RolesGuard + @Roles("ADMIN")`; списки — `TPaginatedItemsResponse` (ADR-007).

---

# Все RPC

Контракты: `apps/common/services/rmq/messaging/`.  
Очереди: `FILMS_QUEUE` → kino-db, `USERS_QUEUE` → auth-users.

## kino-db (`films_queue`)

| Pattern | Домен |
|---------|-------|
| `health.ping` | health |
| `getFilmById` | films |
| `filters` | films |
| `getAllFilmYears` | films |
| `searchFilmsByName` | films |
| `getFilmProfessions` | films |
| `getFilmPersonsByProfession` | films |
| `getSimilarFilms` | films |
| `getAllPersonsPaginated` | persons |
| `getPersonsByProfessionId` | persons |
| `getPersonById` | persons |
| `getPersonFilmography` | persons |
| `findPersonsByNameAndProfession` | persons |
| `getAll.genres` | genres |
| `getAll.countries` | countries |
| `getAll.professions` | professions |
| `createComment` | comments |
| `getCommentsByFilmId` | comments |
| `toggleCommentLike` | comments |
| `admin.films.{list,getById,create,update,delete}` | films (admin) |
| `admin.genres.{list,create,update,delete}` | genres (admin) |
| `admin.countries.{list,create,update,delete}` | countries (admin) |
| `admin.professions.{list,create,update,delete}` | professions (admin) |
| `admin.persons.{list,getById,create,update,delete}` | persons (admin) |

## auth-users (`users_queue`)

| Pattern | Домен |
|---------|-------|
| `health.ping` | health |
| `registration` | users |
| `login` | users |
| `getUserById` | users |
| `refresh` | users |
| `logout` | users |
| `admin.users.list` | users (admin) |
| `admin.users.setRole` | users (admin) |
| `favorites.toggle` | favorites |
| `favorites.remove` | favorites (orphan cleanup при film 404) |
| `favorites.list` | favorites |
| `favorites.ids` | favorites |
| `ratings.upsert` | ratings |
| `ratings.delete` | ratings |
| `ratings.list` | ratings |
| `ratings.grades` | ratings |

Orphan `createRole` удалён (B6, ADR-007) — роли только из посева.

---

# Все доменные области

| Домен | Backend | Frontend FSD | БД |
|-------|---------|--------------|-----|
| Films | `kino-db/films` | `entities/film`, `features/filterFilms`, `loadMoreFilms`, … | Film, Fact, M:N |
| Persons | `kino-db/persons` | `entities/person`, `features/browsePersons*` | Person, M:N |
| Genres / Countries / Professions | `kino-db/*` | `entities/genre\|country\|profession` | словари |
| Comments | `kino-db/comments` | `entities/comment`, `features/commentOnFilm` | Comment, CommentLike |
| Auth / Users / Roles | `auth-users` | `features/auth`, `entities/user`, `src/app/providers` | users, roles, refresh_tokens |
| Favorites / user ratings | `auth-users` + gateway validate film | `toggleFilmFavorite`, `openFilmActions`, `entities/film` api/context; ADR-008 | `user_favorites`, `user_film_ratings` |
| Search / Filters | gateway aggregation | `features/searchCatalog`, `filterFilms` | — |
| Ratings (KP) | поля Film | ссылка на КП в UI | catalog fields |
| Film actions | — | `features/openFilmActions` (panel + share + grade); ADR-004/008 | — |
| Home promo banners | статика (без API) | `widgets/PromoBannerSlider` (loop/dots/autoplay) | — |
| Admin (B2C) | gateway `src/admin` + `*Admin`-сервисы в kino-db/auth-users (ADR-005/007) | `pages/AdminRootLayout` (gate), `widgets/AdminLayout`, `pages/Admin*`, `features/manage*` (apiClient, без стабов) | seed `admin@gmail.com` в `devops/users-db` |

---

# Где искать код

| Что | Куда |
|-----|------|
| Фильмы | `apps/kino-db/src/films` |
| Персоны | `apps/kino-db/src/persons` |
| Комментарии | `apps/kino-db/src/comments` |
| Жанры / страны / профессии | `apps/kino-db/src/{genres,countries,professions}` |
| Авторизация (HTTP) | `apps/api-gateway/src/auth` |
| Авторизация (логика/JWT) | `apps/auth-users/src/{users,tokens,roles}` |
| Favorites / Ratings MS | `apps/auth-users/src/{favorites,ratings}` |
| Favorites / Ratings HTTP | `apps/api-gateway/src/{favorites,ratings}` |
| JWT guards | `apps/api-gateway/src/jwt` |
| Health (GW ready/live) | `apps/api-gateway/src/health` |
| RMQ контракты | `apps/common/services/rmq/messaging` |
| Публичные типы | `apps/common/types/{request,response}` |
| DTO валидация | `apps/common/dto`, `apps/*/dto` |
| Мапперы ORM→Response | `apps/kino-db/src/*/mappers`, `apps/auth-users/src/*/mappers` |
| Admin gateway | `apps/api-gateway/src/admin/{controllers,services,clients}`; guards: `shared/guards/roles.decorator.ts` + `roles.guard.ts`; RPC-ошибки: `shared/helpers/rpcError.helper.ts` (`fromRpc`, `throwHttpFromRpcError`) |
| Admin MS-сервисы | `apps/kino-db/src/*/{controllers,services}/*Admin*`, `apps/auth-users/src/users/{controllers,services}/usersAdmin*` |
| Admin DTO | `apps/common/dto/admin` (`OptionalStrict`/`OptionalNullable` — decorators.ts) |
| Пагинация utils (BE) | `apps/common/utils/{toPaginatedItemsResponse,toAdminListParams}.util.ts` |
| Frontend страницы (UI) | `apps/client/src/pages` |
| Frontend роуты (Next) | `apps/client/app` |
| UX proxy (session redirects) | `apps/client/proxy.ts` (`@/shared/api/session` edge-safe; `matcher` — static literals) |
| App providers (auth composition) | `apps/client/src/app/providers` |
| Auth session actions | `apps/client/src/features/auth/lib/authActions` |
| Session modules | `apps/client/src/shared/api/session/{accessToken,apiClient,sessionCookie,sessionBridge,sessionBootstrap,resolveSessionRedirect}` + `constants.ts` |
| API endpoints + browser base | `apps/client/src/shared/api/endpoints.ts` (`API_ENDPOINTS`, `BROWSER_API_BASE_URL`); SSR gateway — `API_GATEWAY_URL` (`@common/constants/network`) |
| getApiBaseUrl | `apps/client/src/shared/lib/utils/getApiBaseUrl` (читает consts из `endpoints`) |
| Entities / Features / Widgets | `apps/client/src/{entities,features,widgets}` |
| API публичный barrel | `apps/client/src/shared/api` (узкий surface; app-код сюда) |
| Пагинация (shared hook) | `apps/client/src/shared/lib/hooks/usePaginatedResource` |
| Debounce (shared hook) | `apps/client/src/shared/lib/hooks/useDebouncedValue` |
| UI-kit | `apps/client/src/shared/ui` (`ui/`+`model/`+`stories/`+`tests/`; эталон SvgIcon) |
| Vitest | `apps/client/configs/vitest` (`npm test`); Vite 6 + `@vitejs/plugin-react`; typecheck tooling — `tsconfig.tooling.json` |
| Storybook | `apps/client/configs/storybook` (`npm run storybook`); mock `next/image` — `configs/mocks/` |

| Home promo banners | `apps/client/src/widgets/PromoBannerSlider` |
| Horizontal carousel (shared) | `apps/client/src/shared/ui/HorizontalCarousel` |
| Admin shell / pages | `apps/client/src/pages/AdminRootLayout`, `apps/client/src/widgets/AdminLayout`, `apps/client/src/pages/Admin*`, `apps/client/app/admin` |
| Admin manage features | `apps/client/src/features/manage{Films,Genres,Countries,Professions,Persons,Users}` (`api/*Api.ts` на apiClient; `useAdminFilm` в manageFilms) |
| Admin shared UI | `shared/ui/AdminCrudList` (+ `useAdminCrudPanel`, `filterByQuery` для professions), `shared/ui/NotFoundView`, `shared/ui/Select`; nav: `shared/constants` `ADMIN_NAV_ITEMS` |
| Admin types / endpoints | `apps/common/types/{request,response}/admin.ts` (`TAdmin*ItemResponse`), `API_ENDPOINTS.ADMIN` |
| Admin utils | `@common/utils` (`toAdminListParams`, `toILikeContains`, `toPaginatedItemsResponse`); kino-db `src/common/utils` (`rethrowUniqueAsConflict`) |
| Users DB seed | `devops/users-db/users-init-dump.sql` |
| Docker / seed | `docker-compose.yml`, `devops/` |
| Auth ADR | `.cursor/adr/001-jwt-access-opaque-refresh.md` |
| Admin ADR | `.cursor/adr/005-admin-in-b2c.md`, `.cursor/adr/007-admin-be-implementation.md` |
| Правила | `.cursor/context/` |
| Бэклог (FE/BE/Infra) | `.cursor/temp/backlog.md` |
