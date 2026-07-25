# Backend Rules

Область: `apps/api-gateway`, `apps/kino-db`, `apps/auth-users`, `apps/common`.  
См. также: [api.md](./api.md), [microservices.md](./microservices.md), [naming.md](./naming.md).

## Архитектура модуля

- Один Nest-модуль на домен (films, comments, auth, …).
- Слои: `controllers` → `services` → (`queries` / models) → `mappers`.
- Контроллер тонкий: валидация входа, вызов сервиса, без бизнес-логики.
- На gateway: `Controller → Service → *Client (RMQ)` — без прямого Sequelize.

## Mapper / Response

- **Всегда** маппить ORM → `T*Response` перед возвратом из MS.
- **Не** возвращать Sequelize-модели / `toJSON()` «как есть» наружу.
- Мапперы: `*/mappers/*.mapping.ts` (или `*.mapper.ts`).
- Типы ответа брать из `@common/types`, не дублировать интерфейсы локально.

## Services

- Не смешивать построение Query и бизнес-оркестрацию в одном «god»-методе без нужды.
- Тяжёлые фильтры/SQL-сборка — в `queries/` (как в films).
- Facade допустим (`FilmsService`), use-case сервисы — для отдельных сценариев.
- Предпочитать `readonly` для зависимостей и неизменяемых данных.
- **Не** писать сырой SQL внутри сервисов без явной причины; при raw SQL — параметризация.

## Validation

- Вход HTTP: DTO + global `ValidationPipe` (`whitelist`, `transform`).
- DTO с декораторами — в `@common/dto` или локальном `dto/` модуля.
- Не валидировать «руками» то, что уже покрыто class-validator.

## Ошибки и логи

- Ожидаемые ошибки — domain/HTTP exceptions; неожиданные — global filter.
- На gateway маппить RPC-ошибки в стабильные HTTP-коды (не парсить фразы без нужды).
- Не логировать токены, пароли, полные PII.

## TypeScript

- Типы параметров и возвратов явны; избегать `any`.
- `import type` для типов.
- Один публичный export на файл — по возможности сохранять существующий стиль модуля.

## Тесты

- Unit на сервисы/контроллеры (Jest), Arrange-Act-Assert.
- Моки зависимостей; не ходить в реальный RMQ/БД в unit.
