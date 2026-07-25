# Naming Rules

Согласовано с `.cursor/rules/common-types-rules.mdc` и backend-правилами.

## TypeScript типы (`apps/common`)

| Префикс / суффикс | Назначение |
|-------------------|------------|
| `T*Entity` | Поля хранения / домен таблицы |
| `T*Response`, `T*ItemResponse` | Публичный HTTP/RPC ответ |
| `T*OrmModel`, `T*CreationAtt` | Persistence-only |
| `TSearch*Params`, `TGet*Request` | Входные параметры |
| `T*RpcContract` | Typed map pattern → request/response |

- Не публиковать `entity/` и `orm/` из barrel `@common/types`.
- Response строить через `Pick` / `Omit` / `&` от Entity — не копировать поля.

## Backend код

| Сущность | Стиль |
|----------|-------|
| Классы | PascalCase |
| Методы / переменные | camelCase |
| Файлы / папки | kebab-case (как в существующих модулях) |
| Env | UPPER_SNAKE |
| Boolean | `is*`, `has*`, `can*` |
| Функции | глагол в начале |

- Mapper-файлы: `*.mapper.ts`.
- RPC constants: `kinoDbRpc`, `authUsersRpc` — не размазывать строки по сервисам.

## Frontend FSD

- Слайс: `entities/<domain>`, `features/<verbNoun>`.
- Компоненты: PascalCase; хуки: `use*`.
- Обработчики: `handleClick`, `handleSubmit`.
- Public API слайса — `index.ts`.

## HTTP / RPC

- REST ресурсы: множественное число (`/films`, `/persons`).
- RPC pattern: стабильная строка (`getFilmById`); смена = breaking change.
- DTO классы: `CreateUserDto`, `AuthDto` — без префикса `T`.
