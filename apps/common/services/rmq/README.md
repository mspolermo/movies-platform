# RMQ (`@common/services`)

Общий **транспорт и контракт RPC** для Nest-приложений монорепы: `api-gateway` ↔ RabbitMQ ↔ `auth-users` | `kino-db`.

Клиент (`apps/client`) сюда **не** импортирует — только `@common/types`.

Канон: [`.cursor/context/microservices.md`](../../../../.cursor/context/microservices.md).

## Зачем в `apps/common`

Оба конца RPC должны знать **одну** строку pattern и типы request/response. Держать это в common = compile-time coupling монорепы без копипасты и drift между сервисами.

Это не доменный «сервис», а shared wire protocol (+ Nest-обёртка для gateway).

## Состав

| Файл / папка | Назначение |
|--------------|------------|
| `messaging/kino-db.rpc.ts` | Паттерны + `TKinoDbRpcContract` (очередь `FILMS_QUEUE`) |
| `messaging/auth-users.rpc.ts` | Паттерны + `TAuthUsersRpcContract` (очередь `USERS_QUEUE`) |
| `rmq.factory.ts` | URL из env, `createRmqClient` / `createRmqMicroserviceOptions` |
| `rmq.module.ts` | `@Global()` модуль: clients + `RmqService` |
| `rmq.service.ts` | Typed `sendToFilms` / `sendToUsers` |
| `rmq.constants.ts` | DX/URL/очереди, PG assert, DI tokens |
| `rmq.providers.ts` | DI wiring `FILMS_CLIENT` / `USERS_CLIENT` |

Публичный баррель [`index.ts`](./index.ts) / `@common/services`: `RmqModule`, `RmqService`, `createRmqMicroserviceOptions`, `authUsersRpc`, `kinoDbRpc` (+ RPC types).

DX/creds/asserts/DI tokens — **не** в барреле; deep-import `@common/services/rmq/rmq.constants` (или relative внутри пакета).

## Кто что использует

| App | Что берёт |
|-----|-----------|
| **api-gateway** | `RmqModule` в `AppModule`; `RmqService` + `kinoDbRpc` / `authUsersRpc` в clients |
| **kino-db** / **auth-users** | `createRmqMicroserviceOptions` в `main.ts`; `kinoDbRpc` / `authUsersRpc` в `@MessagePattern` |
| **client** | ничего из этой папки |

## Env

| Переменная | Смысл |
|------------|--------|
| `RABBITMQ_URL` | URL. С userinfo — as-is; **без** userinfo + USER/PASS → inject с `encodeURIComponent` |
| `RABBITMQ_USER` / `RABBITMQ_PASS` | Creds; compose apps — обязательны из `.env` (без `:-` DX) |
| `RABBITMQ_HOST` | Опционально, только при сборке URL без `RABBITMQ_URL` |
| `USERS_QUEUE` / `FILMS_QUEUE` | Имена durable-очередей |

В `NODE_ENV=production` factory запрещает пустые creds, user `guest`, DX-пару `mp`/`mp_dev_change_me`, pass &lt; 16 или pass === user.

Compose apps: `RABBITMQ_URL=amqp://rabbitmq:5672` (host-only) + `RABBITMQ_USER`/`PASS` (см. корневой `docker-compose.yml`).

## Новый RPC (чеклист)

1. Pattern + `request` / `response` в `messaging/*.rpc.ts` (строку pattern не менять без lockstep-деплоя обоих концов).
2. Handler: `@MessagePattern(...)` в MS + service; ответ — `T*Response` через mapper, не сырой ORM.
3. Метод client на gateway через `RmqService.sendToFilms` / `sendToUsers`.
4. Обновить [`.cursor/project-index.md`](../../../../.cursor/project-index.md) («Все RPC»).

Ошибки MS: `RpcException({ statusCode, message })`. Gateway: `fromRpc` / `throwHttpFromRpcError`.

## Пример

```ts
// gateway client
return this.rmq.sendToFilms(kinoDbRpc.films.getById, id);

// MS handler
@MessagePattern(kinoDbRpc.films.getById)
getById(@Payload() id: number) { /* … */ }

// MS bootstrap
app.connectMicroservice(createRmqMicroserviceOptions(config, "FILMS_QUEUE"));
```

