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
| `auth-users` | Users, roles, JWT sign, refresh rotation | 3001 | HTTP health (+ `GET /roles/:value`) + RMQ | `db2` |
| `kino-db` | Films, persons, dictionaries, comments | 3002 | HTTP health + RMQ | `db` |
| `rabbitmq` | Очереди `users_queue`, `films_queue` | 5672 / 15672 | AMQP | — |

---

# Все приложения

| App | Путь | Описание |
|-----|------|----------|
| api-gateway | `apps/api-gateway` | Единая HTTP-точка входа |
| auth-users | `apps/auth-users` | Auth / users / roles |
| kino-db | `apps/kino-db` | Контентный домен |
| client | `apps/client` | Next.js FSD UI |
| common | `apps/common` | Types, DTO, RMQ, constants (Nest lib) |

Legacy: `old-client/` — не использовать.

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
| Constants | `apps/common/constants` | Limits, JWT helpers |

Алиас: `@common`, `@common/*` → `apps/common`.

---

# Все публичные API

База: `http://localhost:5001` (Swagger: `/api/docs`).  
Клиент: same-origin `/api/*` → rewrite на gateway.

| Метод | Путь | Auth | Назначение |
|-------|------|------|------------|
| GET | `/health` | Public | Health gateway |
| POST | `/auth/registration` | Public | Регистрация + cookies |
| POST | `/auth/login` | Public | Логин + cookies |
| POST | `/auth/refresh` | Public + OriginGuard | Ротация токенов |
| POST | `/auth/logout` | Public + OriginGuard | Revoke + clear cookies |
| GET | `/auth/me` | JWT | Текущий пользователь |
| GET | `/auth/checkToken` | JWT | **deprecated** → `/auth/me` |
| GET | `/films` | Public | Поиск/фильтры |
| GET | `/films/:id` | Public | Детали фильма |
| GET | `/films/:id/similar` | Public | Похожие |
| GET | `/films/:id/professions` | Public | Профессии в фильме |
| GET | `/films/:id/persons-by-profession` | Public | Каст по профессии |
| GET | `/persons` | JWT* | Список персон |
| GET | `/persons/search` | JWT* | Поиск персон |
| GET | `/persons/:id` | JWT* | Профиль |
| GET | `/persons/:id/filmography` | JWT* | Фильмография |
| GET | `/genres` | JWT* | Жанры |
| GET | `/countries` | JWT* | Страны |
| GET | `/professions` | Public | Профессии |
| GET | `/professions/:professionId/persons` | Public | Персоны по профессии |
| GET | `/filters` | Public | Агрегация фильтров |
| GET | `/filters/quick` | Public | Quick filters (header) |
| GET | `/search` | Public | Глобальный поиск |
| GET | `/comments/:filmId` | JWT | Комментарии |
| POST | `/comments/:filmId` | JWT | Создать комментарий |
| POST | `/comments/:commentId/like` | JWT | Лайк комментария |

\* JWT на gateway; клиент шлёт Bearer после login/refresh.

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

## auth-users (`users_queue`)

| Pattern | Домен |
|---------|-------|
| `health.ping` | health |
| `registration` | users |
| `outRegistration` | users (OAuth-like) |
| `login` | users |
| `getUserById` | users |
| `refresh` | users |
| `logout` | users |
| `createRole` | roles |

**Orphan (MS есть, HTTP/gateway client нет):** `outRegistration`, `createRole`.

---

# Все доменные области

| Домен | Backend | Frontend FSD | БД |
|-------|---------|--------------|-----|
| Films | `kino-db/films` | `entities/film`, `features/filterFilms`, `loadMoreFilms`, … | Film, Fact, M:N |
| Persons | `kino-db/persons` | `entities/person`, `features/getAllPersons*` | Person, M:N |
| Genres / Countries / Professions | `kino-db/*` | `entities/genre\|country\|profession` | словари |
| Comments | `kino-db/comments` | `entities/comment`, `features/getFilmComments` | Comment, CommentLike |
| Auth / Users / Roles | `auth-users` | `features/auth`, `entities/user` | users, roles, refresh_tokens |
| Search / Filters | gateway aggregation | `features/search*`, `filterFilms` | — |
| Ratings (KP) | поля Film | `features/openFilmActions` (UI grade stub) | нет user-ratings таблицы |
| Film actions | — | `features/openFilmActions` (panel + share + grade); ADR-004 | favorite stub до F3 |
| Home promo banners | статика (без API) | `widgets/PromoBannerSlider` (loop/dots/autoplay) | — |

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
| JWT guards | `apps/api-gateway/src/jwt` |
| RMQ контракты | `apps/common/services/rmq/messaging` |
| Публичные типы | `apps/common/types/{request,response}` |
| DTO валидация | `apps/common/dto`, `apps/*/dto` |
| Мапперы ORM→Response | `apps/kino-db/src/*/mappers`, `apps/auth-users/src/users/users.mapper.ts` |
| Frontend страницы (UI) | `apps/client/src/pages` |
| Frontend роуты (Next) | `apps/client/app` |
| UX proxy (session redirects) | `apps/client/proxy.ts` |
| Entities / Features / Widgets | `apps/client/src/{entities,features,widgets}` |
| API клиент | `apps/client/src/shared/api` |
| Пагинация (shared hook) | `apps/client/src/shared/lib/hooks/usePaginatedResource` |
| UI-kit | `apps/client/src/shared/ui` |
| Home promo banners | `apps/client/src/widgets/PromoBannerSlider` |
| Horizontal carousel (shared) | `apps/client/src/shared/ui/HorizontalCarousel` |
| Docker / seed | `docker-compose.yml`, `devops/` |
| Auth ADR | `.cursor/adr/001-jwt-access-opaque-refresh.md` |
| Правила | `.cursor/context/` |
| Бэклог (FE/BE/Infra) | `.cursor/temp/backlog.md` |
