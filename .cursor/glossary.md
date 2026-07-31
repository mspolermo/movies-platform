# Glossary

| Термин | Значение в проекте |
|--------|-------------------|
| **api-gateway** | Единственная публичная HTTP-точка; JWT verify, cookies, прокси в MS |
| **auth-users** | Микросервис пользователей, ролей, подписи JWT, refresh |
| **kino-db** | Микросервис контента (фильмы, люди, словари, комментарии) |
| **common** | `apps/common` — типы, DTO, RMQ, константы |
| **RPC / MessagePattern** | Sync request-reply через RabbitMQ (не HTTP между MS) |
| **kinoDbRpc / authUsersRpc** | Константы pattern-строк + typed contracts |
| **RmqService** | Type-safe обёртка `sendToFilms` / `sendToUsers` |
| **Facade** | `FilmsService` — фасад над use-case сервисами фильмов |
| **Mapper / mapping** | Функции ORM → `T*Response` (`*.mapping.ts`) |
| **T\*Entity** | Поля «как в таблице»; не публичный API фронта |
| **T\*Response** | JSON-форма ответа HTTP/RPC |
| **T\*OrmModel** | Entity + опциональные Sequelize-связи |
| **T\*CreationAtt** | Атрибуты для `Model.create` |
| **DTO** | Nest class с `class-validator` (backend-only) |
| **FSD** | Feature-Sliced Design на клиенте |
| **access token** | Короткий JWT; на клиенте только in-memory |
| **refresh token** | Opaque; HttpOnly cookie; hash в `refresh_tokens` |
| **has_session** | Не HttpOnly cookie — UX-хинт для `proxy.ts` / UI, не security; `HAS_SESSION_*` в `shared/api/session/constants` |
| **proxy.ts** | Next 16 thin proxy: `@/shared/api/session` (без axios) + `resolveSessionRedirect`; `matcher` — static literals |
| **apiClient** | Axios + refresh interceptor; `shared/api/session/apiClient` → default из `@/shared/api` |
| **AppProviders** | FSD `src/app/providers`: `AuthProvider` → `FilmActionsProvider` |
| **usePaginatedResource** | Shared-хук infinite/pagination; база для load-more features |
| **Orphan RPC** | Pattern есть в MS, но gateway HTTP/client его не вызывает |
| **OriginGuard** | Проверка Origin на refresh/logout в production |
| **db / db2** | Postgres: контент / пользователи |
| **films_queue / users_queue** | Durable RMQ-очереди |
| **synchronize** | Sequelize auto-sync схемы (миграций нет) |
| **BFF aggregation** | Сборка ответа из нескольких RPC на gateway (filters, search) |
| **Public / JWT** | Декораторы/guards доступа на gateway |
| **user film rating** | Оценка 1–10 в `user_film_ratings` (auth-users, ADR-008); UI — `openFilmActions` |
| **user favorite** | Избранное в `user_favorites` (auth-users); UI — `toggleFilmFavorite` + panel |
| **отзыв (comment)** | Плоская запись к `filmId` (`title`+`text`); без `parentId`/тредов. См. [ADR-002](./adr/002-flat-film-reviews.md) |
