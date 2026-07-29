# 007. Реализация Admin BE (F1 BE + B5) и проводка FE

- **Статус:** Accepted
- **Дата:** 2026-07-29
- **Участники:** —

## Контекст

ADR-005 зафиксировал FE-стабы админки и целевой контракт BE. Эта запись фиксирует решения, принятые при реализации: admin RPC в kino-db/auth-users, `/admin/*` на gateway с RBAC, снятие FE-стабов. Данные: ~61k персон в БД — plain-массивы в ответах не годятся.

## Решение

### Пагинация всех admin-списков (отклонение от ADR-005)

- Все admin-list ответы — `TPaginatedItemsResponse<T*AdminItemResponse>` (`items` + `total/page/perPage/hasMore` из `@common/types/shared/meta`), а не plain-массивы из таблицы ADR-005.
- Параметры: `page` / `perPage` (default 50, максимум 100) + `q` для films/persons (iLike по name-полям, серверный поиск). Нормализация — `toAdminListParams` (`apps/common/utils`).
- `toPaginatedItemsResponse` перенесён из kino-db в `apps/common/utils` (нужен и auth-users); попутно исправлена опечатка `Iems` → `Items`.
- FE: `usePaginatedResource` + `LoadMoreSection`; для films/persons — debounce 300ms и `resetDeps` по `q`.

### Формат RPC-ошибок MS → gateway

- Admin-хендлеры MS бросают `RpcException({ statusCode, message })`.
- Gateway: helper `throwHttpFromRpcError` (`api-gateway/src/shared/helpers/rpc-error.helper.ts`) перебрасывает `HttpException`; понимает **оба** формата — payload `RpcException` (`statusCode`) и сериализованный `HttpException` (`status` / `response.statusCode`); fallback 500. Без парсинга фраз.
- Отсутствующий id в `getById`/`update`/`delete` → `RpcException 404` → `NotFoundException` (не `null` с 200); на FE `getFilmById` маппит 404 → `null` (контракт хука формы).

### Delete-стратегия (mixed)

| Сущность | Стратегия |
|----------|-----------|
| genre / country | Restrict: 409, если есть строки в `FilmGenre` / `FilmCountry` |
| profession | Restrict: 409, если привязана к персонам (`PersonProfession`) |
| person | Restrict: 409, если занята в фильмах (`FilmPerson`); иначе транзакция: `PersonProfession` → person |
| film | Cascade в транзакции с явным порядком: commentLikes → comments → FilmGenre/FilmCountry/FilmPerson/facts → film (на `synchronize:true` нет гарантий `ON DELETE CASCADE`) |

### Роли без CRUD

- Только 3 роли из посева: `USER`, `ADMIN`, `MANAGER` (`TAppRole`); админка лишь назначает одну активную роль пользователю (`$set`).
- Orphan `authUsersRpc.roles.create` + handler + `CreateRoleDto` удалены (закрывает B6); `RolesService.getRoleByValue` остаётся.
- Инвариант последнего ADMIN: снятие роли ADMIN с последнего администратора → `RpcException 409`. Гонка конкурентных PATCH не закрывается (перебор для админки).

### Канон структуры модулей MS (kino-db layout)

- Папки `controllers/ services/ mappers/ models/ dto/ queries/` + `index.ts`-барреллы; auth-users отрефакторен под этот канон (см. `context/backend.md`).
- Admin-функциональность — отдельные `*Admin`-контроллеры/сервисы в том же доменном модуле (не отдельный admin-модуль в MS).

### Семантика `null` в PATCH (очистка полей)

- Update-типы допускают `null` = «очистить» (`TNullablePartial`); `JSON.stringify` выкидывает `undefined`, поэтому FE в edit-режиме шлёт `null` для опустевших опциональных полей, в create — `undefined`.
- DTO: собственные `Update*Dto` (не `PartialType`) с декораторами `OptionalStrict` / `OptionalNullable` (`@common/dto/admin/decorators.ts`).
- Мапперы MS нормализуют nullable-колонки `null` → `undefined` в ответах.

### Уникальность имён справочников

- create/update жанра/страны/профессии проверяют уникальность имени case-insensitive (`LOWER(...)`) → 409 при дубликате.

### RBAC на gateway

- Создан декоратор `@Roles(...roles)` (`shared/guards/roles.decorator.ts`, `ROLES_KEY = "roles"` — та же строка, что читает `RolesGuard`).
- Все admin-контроллеры: `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles("ADMIN")` на классе; unit-тест проверяет проводку метаданных.
- `AdminModule` импортирует только `JwtConfigModule` (он экспортирует guards и `UserRolesService`; `RmqModule` — global).

### Валидация

- Вход валидирует gateway (`@common/dto/admin/*`, глобальный ValidationPipe); MS доверяют payload после gateway (как существующие хендлеры).

## Последствия

- F1 (BE) и B5 закрыты; B6 закрыт удалением orphan `createRole`.
- FE-стабы админки удалены полностью: `features/manage*/api/*Api.ts` на `apiClient` + `API_ENDPOINTS.ADMIN.*`, хуки на `usePaginatedResource`.
- +1 RPC `getUserById` на каждый admin-запрос (RolesGuard читает роли из БД — снятие ADMIN действует мгновенно); RMQ timeout — тема B3.
- Удаление фильма безвозвратное (без soft-delete); admin RPC идут через общие очереди `films_queue`/`users_queue`.

## Альтернативы

- Plain-массивы для мелких словарей + пагинация только для персон — отклонено (единый формат/инфраструктура FE).
- `ON DELETE CASCADE` на уровне БД — отклонено (schema через `synchronize:true`, нет миграций).
- CRUD ролей — отклонено (3 фиксированные роли из посева достаточно, ADR-005).
- Кэш ролей в JWT/gateway — отклонено (мгновенная реакция на снятие роли важнее лишнего RPC).
