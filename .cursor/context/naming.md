# Naming Rules

Согласовано с `.cursor/rules/common-types-rules.mdc` и backend-правилами.

## Общее

**Всегда camelCase** для имён файлов и папок в новом коде (исключения ниже).  
Kebab-case (`jwt-auth.guard.ts`, `user-role.model.ts`) — только legacy; **при касании файла — переименовать в camelCase** в том же изменении.

## TypeScript типы (`apps/common`)

| Префикс / суффикс | Назначение |
|-------------------|------------|
| `T*Entity` | Поля хранения / домен таблицы |
| `T*Response`, `T*ItemResponse` | Публичный HTTP/RPC ответ |
| `TAdmin*ItemResponse`, `TAdmin*ListResponse` | Admin CRUD item / пагинированный список |
| `T*OrmModel`, `T*CreationAtt` | Persistence-only |
| `TSearch*Params`, `TGet*Request`, `TAdmin*Request` | Входные параметры |
| `T*RpcContract` | Typed map pattern → request/response |

- Не публиковать `entity/` и `orm/` из barrel `@common/types`.
- Response строить через `Pick` / `Omit` / `&` от Entity — не копировать поля.
- Admin item: **`TAdmin{Entity}ItemResponse`** (`TAdminFilmItemResponse`, `TAdminGenreItemResponse`), не `T{Entity}AdminItemResponse`.

## Backend код

| Сущность | Стиль |
|----------|-------|
| Классы | PascalCase |
| Методы / переменные / функции | camelCase |
| **Файлы** | **camelCase** + суффикс роли: `filmsAdmin.service.ts`, `adminKinoDb.client.ts`, `rpcError.helper.ts`, `toAdminListParams.util.ts` |
| **Папки** | camelCase (`userRoles`) или доменное имя (`films`, `admin`) |
| Env | UPPER_SNAKE |
| Boolean | `is*`, `has*`, `can*` |
| Функции | глагол в начале (`to*`, `map*`, `ensure*`, `rethrow*`, `fromRpc`) |

- Utils: `*.util.ts`; helpers: `*.helper.ts`; mappers: `*.mapping.ts` (канон kino-db); `*.mapper.ts` — legacy (auth-users), новые не добавлять.
- Admin в MS: `*Admin.controller.ts` / `*Admin.service.ts` / `*Admin.mapping.ts` в том же доменном модуле.
- Gateway admin: `admin*.controller.ts` / `admin*.service.ts` / `admin*.client.ts`.
- RPC constants: `kinoDbRpc`, `authUsersRpc` — не размазывать строки по сервисам.

## Frontend FSD

- Слайс / папки: camelCase (`entities/<domain>`, `features/<verbNoun>`).
- Компоненты / файлы UI: PascalCase (`AdminFilmsList.tsx`); хуки: `use*` (`useAdminFilms.ts`).
- Обработчики: `handleClick`, `handleSubmit`.
- Public API слайса — `index.ts`.

## HTTP / RPC

- REST ресурсы: множественное число (`/films`, `/persons`).
- RPC pattern: стабильная строка (`getFilmById`); смена = breaking change.
- DTO классы: `CreateUserDto`, `AuthDto` — без префикса `T`.
