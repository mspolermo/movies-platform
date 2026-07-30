# Dependency Graph

Дерево вызовов и зависимости модулей. См. [architecture.md](./architecture.md).

---

## Runtime (запрос)

```
Client (Next.js)
└─ shared/api (axios, /api)
   └─ Next rewrite → API_GATEWAY_URL
      └─ api-gateway
         ├─ Guards (Jwt / Throttler / Origin)
         ├─ Domain Module (Controller → Service → Client)
         └─ RmqService
            ├─ sendToUsers → users_queue → auth-users
            │    ├─ UsersController (@MessagePattern)
            │    ├─ UsersService / TokensService / RolesService
            │    ├─ users.mapper
            │    └─ PostgreSQL db2 (users, roles, user_roles, refresh_tokens)
            └─ sendToFilms → films_queue → kino-db
                 ├─ *Controller (@MessagePattern)
                 ├─ Facade / Use-case Service
                 ├─ queries/ (films)
                 ├─ *.mapping.ts
                 └─ PostgreSQL db (Film, Person, Comment, …)
```

### Пример: детали фильма

```
Client
↓ GET /films/:id
API Gateway FilmsController
↓ FilmsService
↓ FilmsClient / RmqService.sendToFilms
↓ pattern: getFilmById
kino-db FilmsController
↓ FilmsService (facade)
↓ FilmDetailsService
↓ Film model + includes
↓ mapFilmToDetailsResponse
↓ TFilmDetailsResponse
Postgres (db)
```

### Пример: login

```
Client
↓ POST /auth/login
API Gateway AuthController
↓ AuthService
↓ AuthClient → users_queue "login"
auth-users UsersController
↓ UsersService (bcrypt)
↓ TokensService.createTokenPair
↓ refresh_tokens insert
↓ users.mapper → TAuthUsersRpcAuthResponse
API Gateway → Set-Cookie + { user, accessToken }
```

### Пример: filters (агрегация на gateway)

```
Client → GET /filters
FiltersService
├─ sendToFilms getAll.genres
├─ sendToFilms getAll.countries
└─ sendToFilms getAllFilmYears
→ объединение в ответ фильтров
```

### Пример: admin CRUD (ADR-007)

```
Client (features/manage*) → PATCH /admin/genres/:id (Bearer)
API Gateway AdminGenresController
↓ JwtAuthGuard → RolesGuard (@Roles("ADMIN") → RPC getUserById за ролями)
↓ AdminGenresService (throwHttpFromRpcError)
↓ AdminKinoDbClient → films_queue "admin.genres.update"
kino-db GenresAdminController → GenresAdminService
↓ уникальность имени / 404 → RpcException {statusCode, message}
↓ mapGenreToAdminItem → TAdminGenreItemResponse
admin.users.* — аналогично через users_queue → auth-users UsersAdminController
```

---

## Compile-time зависимости apps

```
apps/client
└─ @common/types          (request + response only)

apps/api-gateway
├─ @common/types
├─ @common/dto
├─ @common/services/rmq   (RmqModule client)
└─ @common/constants

apps/kino-db
├─ @common/types (+ orm)
├─ @common/dto (где нужно)
├─ @common/services/rmq   (microservice options + patterns)
└─ @common/constants

apps/auth-users
├─ @common/types (+ orm)
├─ @common/dto
├─ @common/services/rmq
└─ @common/constants

apps/common
└─ (нет зависимости на apps/*)
```

---

## Frontend FSD (импорты)

```
app/ (routes)
└─ pages/
   └─ widgets/
      └─ features/
         └─ entities/
            └─ shared/
```

Разрешено: слой → нижележащие.  
Запрещено: вверх и «через соседа» (контролирует eslint-plugin-boundaries).

---

## Очереди RabbitMQ

| Env | Default | Consumer | Producer |
|-----|---------|----------|----------|
| `USERS_QUEUE` | `users_queue` | auth-users | api-gateway |
| `FILMS_QUEUE` | `films_queue` | kino-db | api-gateway |

Паттерн: **request-reply** (`ClientProxy.send` + `@MessagePattern`).  
Event/pub-sub (`@EventPattern`) не используется.

---

## Docker Compose зависимости

```
api-gateway → rabbitmq (healthy)
auth-users  → rabbitmq + db2 (healthy)
kino-db     → rabbitmq + db (healthy)
kino-db-seed → db + kino-db (started)
pgadmin     → db + db2
```

Client вне compose.

---

## Запрещённые зависимости

- Client → Nest runtime / dto / orm / entity / services
- Gateway → Postgres
- Микросервисы → друг другу (только через gateway + RMQ контракт)
- Изменение pattern-строк RPC без одновременного обновления обоих концов + common

## Orphan RPC

Нет (orphan `createRole` удалён — B6, ADR-007).
