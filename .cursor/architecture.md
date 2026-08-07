# Архитектура

Компактная карта слоёв и потоков. Индекс: [project-index.md](./project-index.md).  
Граф вызовов: [dependency-graph.md](./dependency-graph.md).

---

## Слои системы

```
┌─────────────────────────────────────────────┐
│  apps/client (Next.js App Router + FSD)     │
│  app/ routes → pages → widgets → features   │
│  entities → shared/api (axios)              │
└──────────────────┬──────────────────────────┘
                   │ HTTP /api → rewrite
┌──────────────────▼──────────────────────────┐
│  api-gateway                                │
│  Controller → Service → *Client (RMQ)       │
│  Guards: JWT, Throttler, Origin             │
└──────────────────┬──────────────────────────┘
                   │ ClientProxy.send
┌──────────────────▼──────────────────────────┐
│  RabbitMQ                                   │
│  users_queue  |  films_queue                │
└────────┬──────────────────┬─────────────────┘
         │                  │
┌────────▼────────┐  ┌──────▼──────────────┐
│  auth-users     │  │  kino-db            │
│  @MessagePattern│  │  @MessagePattern    │
│  Service→Mapper │  │  Facade→UseCase     │
│  → Postgres db2 │  │  → Mapper → db      │
└─────────────────┘  └─────────────────────┘
```

Shared: `apps/common` (types/dto/rmq) — импортируют все backend apps + client (только types).

---

## Поток чтения (фильм)

```
Client
  ↓ GET /api/films/:id
API Gateway (FilmsController → FilmsService → FilmsClient)
  ↓ RmqService.sendToFilms("getFilmById", id)
RabbitMQ films_queue
  ↓
kino-db FilmsController (@MessagePattern)
  ↓ FilmsService (facade) → FilmDetailsService
  ↓ Sequelize Film + includes
  ↓ mapFilmToDetailsResponse
  ↓ TFilmDetailsResponse
API Gateway → JSON → Client
```

---

## Поток записи (комментарий)

```
Client (Bearer access)
  ↓ POST /api/comments/:filmId
API Gateway JwtAuthGuard → userId + email (JWT)
  ↓ authorName = email local-part (B33: → user.name)
  ↓ fromRpc(sendToFilms("createComment", …))
kino-db → Comment persist → map → TCommentResponse
```

---

## Поток auth

```
Login/Register → auth-users (sign JWT + store refresh hash)
  → gateway Set-Cookie refreshToken (HttpOnly) + has_session
  → body { user, accessToken }

Refresh → cookie → rotate (reuse → revoke all)
Logout → revoke + clear cookies

Access token: только in-memory на клиенте.
Подпись JWT: только auth-users. Gateway — verify-only.
```

Решение auth: [ADR-001](./adr/001-jwt-access-opaque-refresh.md).  
Известный долг / бэклог: [temp/backlog.md](./temp/backlog.md).

---

## Поток favorites / user ratings (ADR-008)

```
Write PUT /ratings/:filmId:
  JWT → gateway getFilmById
    → ok: ratings.upsert
    → 404: ratings.delete (orphan cleanup) + HTTP 404

Write POST /favorites/:filmId:
  JWT → gateway getFilmById
    → ok: favorites.toggle
    → 404: favorites.remove (orphan cleanup, без create)

Read compact (панель): GET /favorites/ids | GET /ratings/grades → auth-users
Read list (профиль later): GET /favorites | GET /ratings (TPaginatedItemsResponse)

DELETE /ratings/:filmId — без validate film (idempotent)
Path filmId: ParsePositiveIntPipe (>= 1)
```

Prefs в `db2` (`user_favorites`, `user_film_ratings`); `filmId` без FK на kino.

---

## Backend-слои (внутри сервиса)

| Слой | Gateway | kino-db / auth-users |
|------|---------|----------------------|
| HTTP / RMQ boundary | `controllers/` | `@MessagePattern` controllers |
| Оркестрация | `services/` + `clients/` | facade / use-case services |
| Query building | — | `films/queries/` |
| Persistence | — | Sequelize `models/` |
| Mapping | почти нет (прокси) | `*/mappers/*.mapping.ts` |
| Validation | DTO + ValidationPipe | DTO на входе где нужно |
| Contracts | `@common/types`, rpc | то же |

**Паттерны в коде:**

- **Facade:** `kino-db` `FilmsService` → `FilmDetails|Catalog|Cast|SimilarService`
- **Mapper:** ORM model → `T*Response` (не отдавать Sequelize наружу)
- **Typed RPC:** `TKinoDbRpcContract` / `TAuthUsersRpcContract`
- **BFF aggregation:** gateway `FiltersService`, `SearchService`, частично comments

---

## Frontend-слои (FSD)

| Слой | Путь | Правило |
|------|------|---------|
| Routes | `apps/client/app/` | Тонкие RSC-обёртки + `AppProviders` |
| App (FSD) | `src/app/` | `styles/` + `providers/` (composition) |
| Pages | `src/pages/` | Композиция widgets |
| Widgets | `src/widgets/` | Крупные блоки UI (chrome; без global auth providers) |
| Features | `src/features/` | Сценарии пользователя |
| Entities | `src/entities/` | Домен + api + ui |
| Shared | `src/shared/` | api, ui-kit, lib, constants |

Данные: **нет React Query**. SSR/RSC + Server Actions (`getCountriesList` / `getGenresList` / `getFilmsFilters`) + axios + `usePaginatedResource` / feature-hooks.  
State: Zustand только `useUserStore` (`entities/user`).  
HTTP/session: `shared/api` (`endpoints` + `auth/*` + `session/*`); app → `@/shared/api`; proxy → `@/shared/api/session` (edge-safe, без axios).  
UX redirects: thin `proxy.ts` → `resolveSessionRedirect` + `has_session` (не security); `matcher` — static literals. Auth composition: `src/app/providers`.

---

## Запрещённые направления зависимостей

| Запрет | Почему |
|--------|--------|
| Client → auth-users / kino-db напрямую | Только через gateway |
| Client → `@common/dto` / `@common/types/orm` / `entity` / `services` | Только request/response |
| kino-db ↔ auth-users напрямую | Нет связи; оркестрация на gateway |
| Gateway → Postgres | БД только у MS |
| MS → gateway / чужая БД | Односторонний RPC client |
| FSD: shared → entities/features | Нарушение boundaries |
| Возврат ORM-моделей в RPC/HTTP | Только mapped Response |

---

## Инфраструктурные факты

- Schema: `synchronize: true` (миграций Sequelize нет; seed в `devops/`)
- Health: GW `/health` (ready, 503) + `/health/live`; MS HTTP `/health` с DB authenticate; Docker HC + `depends_on` MS healthy
- Graceful shutdown: SIGTERM handlers есть; полноценный `app.close()` — слабо
- CI: GitHub Actions в репо нет
- Client **не** в docker-compose — локальный `npm run dev`
