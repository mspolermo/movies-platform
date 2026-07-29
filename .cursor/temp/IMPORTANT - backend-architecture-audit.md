# Архитектурный аудит backend

**Дата:** 2026-07-19  
**Стек:** NestJS 9 · TypeScript · RabbitMQ (Nest ClientProxy RPC) · Sequelize · PostgreSQL ×2  
**Объём:** `api-gateway`, `auth-users`, `kino-db`, `apps/common`

---

## Часть 1. Общий вердикт

### Итоговый уровень: **Strong Middle**

Сильные стороны реальные: осознанный split auth/content, typed RMQ-контракты, слой `@common/types` (entity → response/request/orm), refresh rotation с reuse-detection, тонкий gateway Client→Service→Controller.

Слабые стороны системные: это **не микросервисы 2026**, а **два sync-RPC воркера за RabbitMQ**. Нет timeout/retry/circuit breaker, `synchronize: true`, RolesGuard мёртв, пагинация разъехалась, FilmsService — god-object, поиск через `ILIKE %…%` без индексов.

На 3–5 лет при росте команды/нагрузки текущая форма **не выдержит без рефакторинга транспорта и data-слоя**. Как учебный/MVP-бэкенд с хорошими контрактами — да. Как production-grade — нет.

| Область | Оценка | Почему |
| ------- | ------ | ------ |
| Архитектура | **5/10** | Gateway + 2 сервиса ок для размера; sync RMQ = distributed monolith |
| Микросервисы | **5/10** | Граница auth/content здравая; оркестрация и fan-out на gateway |
| NestJS | **7/10** | Модули предсказуемы; FilmsService / dead RolesGuard |
| RMQ | **4/10** | Typed send — плюс; иначе чистый sync RPC без resilience |
| Common Types | **8/10** | Лучшая часть бэка; мелкий drift пагинации/Role.description |
| API Contracts | **6/10** | Типы есть; версии нет; nullable раздуты; docs drift |
| Безопасность | **6/10** | Auth flow зрелый; RBAC мёртв; RMQ trust; sync schema |
| База данных | **4/10** | synchronize; мало индексов; тяжёлые join/ILIKE |
| Масштабируемость | **4/10** | Одна очередь/сервис; 3 RMQ на filters; нет кэша |
| Поддерживаемость | **6/10** | Структура читаемая; мёртвый код + рассинхрон docs |

---

## 1. Общая архитектура микросервисов

**Оценка: 5/10**

### Что сделано правильно

- **Граница auth vs content** — единственный осмысленный split: `auth-users` (users/roles/tokens) и `kino-db` (каталог). Это не искусственное дробление по таблицам.
- **api-gateway как единственная HTTP-граница** — клиент не ходит в микросервисы напрямую. Health на :3001/:3002 — ок для internal.
- **Нет Sequelize между сервисами** — по проводу только JSON по typed-контрактам. Это лучше, чем «shared DB + shared models».

### Что плохо

#### Sync RPC поверх RabbitMQ = distributed monolith

Каждый бизнес-запрос: HTTP → `ClientProxy.send` → queue → handler → reply. Нет событий, нет eventual consistency, нет независимых deploy-циклов с обратной совместимостью сообщений.

По сути это **удалённые вызовы методов** с latency/ops-ценой брокера. Если убрать RMQ и поставить HTTP/gRPC между теми же тремя процессами — поведение почти не изменится. Значит границы сервисов **не оправданы сложностью транспорта**.

#### Логика не в том сервисе / утечка оркестрации

| Место | Проблема |
|-------|----------|
| `CommentsService` (gateway) | При create: RMQ `getUserById` → локально `authorName` из email → RMQ `createComment`. **Денормализация имени автора живёт на gateway**, kino-db не знает users. Classic saga/orchestration smell на BFF. |
| `FiltersService` (gateway) | 3 параллельных RMQ (genres + countries + years) на каждый `/filters`. Справочники должны быть **один endpoint / один кэш** в kino-db или CDN. |
| `SearchService` | Fan-out films+persons — ок для BFF, но без таймаутов/частичного ответа. |

#### Слишком сильное знание друг о друге

- Gateway знает **все** pattern-строки и request/response shapes обоих сервисов (через common — это нормально для контрактов, но **coupling высокий**: любое изменение kino-db RPC ломает gateway compile-time — хорошо для монорепы, плохо для независимого ownership).
- kino-db доверяет `userId` / `authorName` из payload без проверки подписи сообщения (задокументировано как «ok в docker-сети» — для prod недостаточно).

#### Separation of concerns

| Слой | Вердикт |
|------|---------|
| Gateway controllers | В основном HTTP/Swagger/cookies — ок |
| Gateway services | Тонкие прокси — ок; comments/filters — уже business orchestration |
| Microservice controllers | Thin `@MessagePattern` — ок |
| Microservice services | Transaction Script + Sequelize — основная логика здесь |

**Вывод по границам:** для текущего продукта хватило бы **монолита Nest + 2 БД** (или даже 1 БД с схемами) и HTTP. Микросервисы сейчас — **premature distribution**.

---

## 2. RabbitMQ архитектура

**Оценка: 4/10**

### Что хорошо

- Typed contracts: `TKinoDbRpcContract` / `TAuthUsersRpcContract` + `RmqService.sendToFilms/Users` — compile-time safety редкая и ценная.
- Durable queues.
- Константы паттернов в одном месте (`kino-db.rpc.ts`, `auth-users.rpc.ts`).

### Что плохо / риски

| Проблема | Почему критично |
|----------|-----------------|
| **Только request/reply** | Нет `@EventPattern`, нет outbox, нет async workflows. RMQ как «медленный HTTP». |
| **Нет timeout** | `firstValueFrom(client.send(...))` без `timeout()`. Зависший consumer = вечный HTTP. |
| **Нет retry / DLQ / nack policy** | Дефолтный Nest RMQ; при ошибке поведение неочевидно для ops. |
| **Нет circuit breaker / bulkhead** | Падение kino-db валит весь gateway UX. |
| **Нет версионирования сообщений** | Pattern strings (`"filters"`, `"getFilmById"`) — breaking change = deploy lockstep. |
| **Error mapping через string includes** | `AuthService.handleAuthError` парсит русские/английские фразы из RPC. Хрупко, i18n-ад. |
| **Нет correlation/observability контракта** | Trace id через RMQ не проброшен системно. |
| **Одна очередь на сервис** | `films_queue` / `users_queue` — все операции конкурируют; тяжёлый `filters` блокирует `getFilmById`. |
| **prefetch / concurrency** | Не настроены явно в factory. |

### Что изменить (по приоритету)

1. Либо **убрать RMQ** → gRPC/HTTP между сервисами (честный sync).
2. Либо оставить RMQ, но: `timeout` + typed error codes (`RpcException` с `code`) + DLQ + отдельные queues для heavy queries + event bus для side-effects (comment created → analytics).
3. Перенести `getFiltersAggregate` в kino-db одним RPC.

---

## 3. NestJS архитектура

**Оценка: 7/10**

### Плюсы

- Повторяемый паттерн gateway: `controllers / services / clients / dto`.
- Модули по доменам, без `forwardRef` циклических Nest-зависимостей.
- Global `ValidationPipe` (whitelist + transform) на gateway.
- `GlobalExceptionFilter` — базовый safety net.
- Mappers в kino-db отделены от Sequelize models.

### Минусы

| Запах | Где |
|-------|-----|
| **God-service** | `kino-db` `FilmsService` ~430 LOC: getById, filters, similar, years, professions, persons-by-profession |
| **Dead code** | `RolesGuard` + `UserRolesModule` (модуль не в AppModule); guard нигде не `@UseGuards` |
| **Fat-ish controllers** | `auth.controller` / `films.controller` раздуты Swagger + cookie wiring (приемлемо, но шумно) |
| **Business logic на gateway** | authorName resolution, locale label pick для filters |
| **SOLID** | FilmsService нарушает SRP; OCP — добавление фильтров = правка того же метода |
| **console.log в guards** | JwtAuthGuard / RolesGuard — шум и потенциальная утечка в логи |
| **DTO дубли** | `FilmFiltersDto` в kino-db ≈ `TSearchFilmsParams` + gateway query DTO |
| **HttpException из auth-users** | Через RMQ статус/тело сериализуются грязно; gateway ловит string matching |

Нет классических fat controllers с SQL. Это **service-centric Nest**, не Clean Nest.

---

## 4. Domain Layer

**Оценка близости:**

| Стиль | Близость |
|-------|----------|
| **Transaction Script** | **~85%** — логика в сервисах, модели = bags of fields |
| **Clean Architecture** | **~15%** — есть «контракты» в common, но нет use-cases / domain services / ports-adapters кроме RMQ clients |
| **DDD** | **~5%** — нет aggregates, invariants в домене, ubiquitous language размазан по Sequelize |

**Анемичная модель:** да, и для каталога это нормально. Проблема не в анемии, а в том, что **правила (похожие фильмы, фильтры, лайки) живут в одном сервисе без выделения query/command**.

Комментарии: likesCount считается scan'ом likes table на страницу — доменная операция без денормализованного счётчика.

---

## 5. apps/common — полный аудит

**Оценка: 8/10** (лучшая зона бэка)

### Структура (как задумано — и в целом соблюдено)

```
types/entity  → поля хранения
types/response → Pick/Omit от entity (+ JSON dates as string)
types/request  → query/RPC params
types/orm      → CreationAtt + OrmModel (backend-only)
dto/           → class-validator (backend)
services/rmq/  → инфраструктура + RPC contracts
constants/     → LIST_*, JWT
```

Публичный barrel `@common/types` = **только request + response**. Entity/orm не торчат клиенту. Это правильное решение и редкая дисциплина.

### Контракты

| Тема | Вердикт |
|------|---------|
| Дублирование типов | Низкое для film/user; **DTO vs type** дублируются намеренно (validators) — ок, но `FilmFiltersDto` в kino-db не в common/dto |
| DTO ↔ response | Auth: `CreateUserDto` → `TAuthUsersRpcAuthResponse` → gateway strips refresh → `TAuthResponse` — согласовано |
| Рассинхрон front/back | Общий barrel снижает риск; **пагинация persons** (`TPaginatedPersonsResponse` без `page`/`perPage`) vs films/comments (`TPaginationMeta`) — клиент вынужден ветвиться |
| Лишние типы | `TRegistrationResponse` / `TRefreshTokenResponse` = алиасы `TAuthResponse` — harmless noise |
| OAuth stub | ~~`OauthCreateUserDto` + `outRegistration`~~ — удалён ([ADR-006](../adr/006-no-oauth.md))

### Границы common

| Риск | Статус |
|------|--------|
| Свалка | **Нет** — узкий scope (types/dto/rmq/constants) |
| Домен через common | **Нет** бизнес-логики в common — хорошо |
| Entity как DTO | **Нет** на публичном API |
| Sequelize модели по проводу | **Нет**; orm-типы только для моделей сервисов |

### Типизация — проблемные зоны

#### TFilm*

- `TFilmEntity` богаче, чем отдаёт API (imdb, top10, premiereWorldDate) — нормально как storage shape.
- `TFilmDetailsResponse` — optional `countries?/genres?/facts?` при том что getById почти всегда их грузит → лишний nullable для клиента.
- `premiereCountry` в list item, но не в details Pick — странная асимметрия.
- `FilmFiltersDto` (kino-db) требует `page`/`perPage` required, `TSearchFilmsParams` — optional → рассинхрон контракта request.

#### TUser* / TAuth*

- JWT payload: `{ sub, email }` — **roles не в токене**. RolesGuard ходит в RMQ за пользователем (если бы использовался) — дорого и правильно с точки зрения revoke, но RBAC не включён.
- `TRoleEntity.description?` есть в типе, **колонки в Sequelize Role нет** — drift entity ↔ DB.
- `TAuthUsersRpcAuthResponse` правильно отделён от HTTP `TAuthResponse` (refresh только на wire RMQ).

#### Комментарии

- `createdAt: string` в response — правильно для JSON.
- `liked?` optional — ок для public list.
- Нет `parentId` (дерево в docs — вранье).
- `authorName` денормализован навечно — смена email/имени не обновит старые комментарии.

#### Пагинация / фильтры

| Контракт | Поля |
|----------|------|
| `TPaginationMeta` | total, page, perPage, hasMore |
| `TPaginatedPersonsResponse` | items, total, hasMore — **без page/perPage** |
| Persons request | `limit` |
| Films request | `perPage` |

Это уже техдолг контрактов, не «мелочь».

---

## 6. API Contracts

**Оценка: 6/10**

### REST (gateway)

- Публичный каталог в основном `@Public` / без guard — ок для B2C.
- Swagger есть.
- **Нет `/v1`** — любое breaking change = боль клиента.
- Docs (`PROJECT_ARCHITECTURE`) врёт: JWT на persons/genres/countries, Comment.parentId, 17 vs 18 RMQ patterns, sequence createComment без getUserById.

### RMQ

- Typed — сильная сторона.
- Incompatible ответы возможны только при ручном обходе типов (мало).
- Утечки внутренних моделей: **нет** (mappers режут поля).
- Неявные поля: optional `?` на связях фильма; `null` vs `[]` vs empty inconsistently (`getSimilar` null если нет фильма, `[]` если нет жанров).
- RPC errors не контрактны (нет `TRpcError`).

---

## 7. Безопасность

**Оценка: 6/10**

### Реальные сильные стороны

- Access short-lived + opaque refresh (64 bytes) + SHA-256 at rest.
- Refresh **rotation** + **reuse → revoke all** в транзакции с `LOCK.UPDATE` — senior-level auth.
- Cookie: HttpOnly, Secure (prod), SameSite=Lax, Path=`/api/auth`.
- OriginGuard на refresh/logout в production.
- Throttle на auth: 5/min login/reg, 30/min refresh.
- bcrypt для паролей; password не уходит в RMQ responses (mapper).
- `PRIVATE_KEY` обязателен в production (`resolveJwtSecret`).

### Реальные уязвимости / gaps сейчас

| Severity | Issue |
|----------|-------|
| **High (ops)** | `synchronize: true` на обеих БД — schema drift / data loss риск в любом «почти prod» |
| **Medium** | RBAC мёртв: `RolesGuard` не навешан; admin-эндпоинтов нет, но `createRole` по RMQ доступен любому, кто достучится до очереди |
| **Medium** | RMQ payload trust: подмена `userId` при доступе к брокеру = комментарии/лайки от чужого имени |
| **Medium** | auth-users HTTP `GET /roles/:value` — если порт торчит наружу |
| **Low–Med** | Throttler global 100/min — auth отдельно ок; остальной API слабо защищён от scrape |
| **Low** | bcrypt rounds = 10 (2026 чаще 12+) |
| **Low** | JWT без `roles`/`jti` — ок для verify-only, но logout access не инвалидирует до expiry |
| **Low** | Error messages на login различают «user not found» vs «wrong password» **внутри auth-users**; gateway схлопывает для клиента — хорошо на границе, плохо если RMQ/logs утекут наружу |
| **Info** | `has_session` не security — задокументировано честно |
| **Info** | CSRF: SameSite+OriginGuard — адекватно для cookie refresh |

Нет секретов в репозитории в рамках этого аудита кода; риск — **дефолты JWT в non-production** (ожидаемо).

---

## 8. Работа с БД

**Оценка: 4/10**

### Sequelize usage

- Модели типизированы через `@common/types/orm` — хорошо.
- Associations плотные (Film↔Person↔Genre↔Comment) — типичный Sequelize graph.
- Транзакции: refresh tokens, toggle like — есть где надо.
- **`synchronize: true`** — главный anti-pattern для роста.

### Производительность — что сломается

| Место | Риск |
|-------|------|
| `filmFilters` | M2M `required: true` includes + `findAndCountAll` + `distinct` — на 500k фильмов тяжело без денормализации/материализованных путей |
| `searchFilmsByName` / persons search | `ILIKE '%name%'` — seq scan, нет trigram/GIN |
| `getFilmProfessions` | Грузит **всех persons фильма с professions**, агрегирует в JS — N persons × M professions в память |
| `getComments` likes | Грузит все likes страницы, считает в JS; лучше `GROUP BY` / denormalized `likesCount` |
| `getSimilarFilms` | 2–3 запроса, GROUP BY — ок на малых данных; без индекса по genreId+filmId будет больно |
| Indexes | Явно мало (`PersonProfession`, `CommentLike`); на Film.year / votesKp / name — не видно в моделях |
| Filters years | `DISTINCT year` full scan periodically |

### N+1

Явного ORM N+1 в горячих путях мало (includes / separate facts). Больше проблема — **over-fetch** и **неоптимальные агрегации**.

---

## 9. Масштабируемость (1M users / 500k films / 15 devs)

### Что сломается первым

1. **`GET /films` filters** — join hell + count distinct.
2. **`GET /filters`** — 3 sync RPC × каждый SSR/клиент.
3. **Поиск ILIKE** — CPU на Postgres.
4. **Единая `films_queue`** — latency spikes от тяжёлых запросов.
5. **RMQ sync без timeout** — каскадные таймауты на gateway при деградации kino-db.
6. **Comments authorName orchestration** — лишний hop на каждый POST.

### Что потребует рефакторинга при 15 разработчиках

- Разрезать `FilmsService` / возможно выделить `FilmQueryService` / search index (OpenSearch).
- Версионирование API + ownership по пакетам/сервисам (сейчас monorepo lockstep — ок до ~8 людей, дальше нужны module boundaries/CI owners).
- Убрать dead RolesGuard или внедрить RBAC по-настоящему.
- Migrations вместо synchronize.
- Контрактные RPC errors вместо string matching.
- Возможно схлопнуть микросервисы обратно или заменить RMQ на gRPC — иначе onboarding «зачем брокер» будет дорогим.

---

## 10. Переусложнения

| Что | Почему overengineering |
|-----|------------------------|
| RabbitMQ как транспорт для sync CRUD | Нет async advantage; добавлена ops-сложность |
| Три процесса + две БД при одном продукте/команде | Граница auth оправдана слабее, чем стоимость |
| `UserRolesService` + RolesGuard без применения | Абстракция без use-case |
| OAuth RPC stub | ~~Контракт без реализации~~ — удалён ([ADR-006](../adr/006-no-oauth.md))
| Алиасы `TRegistrationResponse` / `TRefreshTokenResponse` | Шум |
| JwtAuthGuard на классе + `@Public` на всех методах films | Ритуал без эффекта |
| Locale label mapping на gateway для filters | Можно в kino-db одним ответом |

**Premature optimization:** почти нет (кэшей/шардинга нет). Наоборот — premature **distribution**.

**Что упростить:**

1. Monolith (или modular monolith) + optional extract auth later.
2. Один `getCatalogFilters` RPC.
3. Удалить мёртвый Roles wiring или довести до конца (OAuth stub снят — [ADR-006](../adr/006-no-oauth.md)).
4. Унифицировать пагинацию на `TPaginationMeta`.

---

## 11. Недоработки (техдолг)

1. `synchronize: true` → миграции (Umzug/Flyway/liquibase — не важно, главное versioned SQL).
2. RMQ resilience: timeout, typed errors, DLQ, queue split.
3. Индексы + поиск (pg_trgm / отдельный search).
4. Единый pagination contract.
5. Roles: либо вырезать, либо JWT claims + guard на admin routes.
6. `FilmsService` split (query vs similar vs filters).
7. Denormalize `likesCount` / пересмотреть `authorName` lifecycle.
8. Docs sync (`PROJECT_ARCHITECTURE`, auth path filenames).
9. Observability: OpenTelemetry trace across HTTP→RMQ→DB.
10. `forbidNonWhitelisted` / строже ValidationPipe; rate limit на write comments.
11. Убрать `console.log` из security path.
12. Cookie `maxAge` — проверить единообразие ms (сейчас SEC×1000 для express — ок, но имя константы путает).

---

## 12. Итоговая таблица и уровень

| Область | Оценка |
| ---------------- | ------ |
| Архитектура | **5/10** |
| Микросервисы | **5/10** |
| NestJS | **7/10** |
| RMQ | **4/10** |
| Common Types | **8/10** |
| API Contracts | **6/10** |
| Безопасность | **6/10** |
| База данных | **4/10** |
| Масштабируемость | **4/10** |
| Поддерживаемость | **6/10** |

### Уровень: **Strong Middle**

**Почему не Middle:** typed RPC contracts, refresh rotation с reuse detection, дисциплина `@common/types`, тонкий gateway layering, осмысленный auth cookie design — это выше среднего рынка Nest-CRUD.

**Почему не Senior / Production-grade:** транспорт притворяется микросервисами; нет operational maturity (migrations, timeouts, indexes, observability); RBAC мёртв; god-service и контрактный drift пагинации; docs врут.

**3–5 лет:** поддерживаемо **только** если либо (a) схлопнуть distribution и усилить modular monolith + DB, либо (b) довести микросервисы до настоящих (async, versioned contracts, independent data ownership, search/cache). В текущем виде команда из 15 упрётся в очередь и в FilmsService раньше, чем в «границы доменов».
