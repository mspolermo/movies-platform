# Microservices Rules

См. [backend.md](./backend.md), [api.md](./api.md), [dependency-graph](../dependency-graph.md).

## Границы

| Сервис | Владеет |
|--------|---------|
| api-gateway | HTTP, auth cookies, JWT verify, агрегация |
| auth-users | users, roles, JWT sign, refresh_tokens |
| kino-db | films, persons, dictionaries, comments |

- Клиент → **только** gateway.
- MS не вызывают друг друга.
- Оркестрация cross-domain (user + comment) — на gateway, осознанно и минимально.

## RMQ

- Транспорт: RabbitMQ, durable queues `users_queue` / `films_queue`.
- Только request-reply (`send` + `@MessagePattern`), пока нет ADR на events.
- Паттерны и типы — **только** в `apps/common/services/rmq/messaging/*.rpc.ts`.
- Новый RPC чеклист:
  1. Добавить pattern + request/response в contract
  2. Handler в MS controller + service
  3. Client method на gateway
  4. Обновить [project-index](../project-index.md)
- Не менять строковые значения pattern без lockstep-деплоя обоих концов.
- Не доверять RMQ payload как публичному API: gateway уже аутентифицировал; всё равно валидировать форму данных.
- Orphan RPC не заводить: есть handler → есть gateway-клиент (прецедент `createRole` удалён, ADR-007).

## Ошибки RPC (ADR-007)

- MS в admin/новых хендлерах бросают `RpcException({ statusCode, message })` — не HttpException.
- Gateway: `fromRpc` / `throwHttpFromRpcError` (`api-gateway/src/shared/helpers/rpcError.helper.ts`) — оба формата (`statusCode` и сериализованный `HttpException`), fallback 500; фразы не парсить.
- Отсутствующий id → `RpcException 404` (не `null` с успешным ответом).

## Resilience (ожидание)

- Добавляя вызовы: думать про timeout (сейчас слабо); не блокировать health.
- Тяжёлые fan-out на gateway (filters) не размножать без кэша/объединённого RPC.

## Deploy / ownership

- Контракты в common = compile-time coupling монорепы — ок; breaking RPC = один PR на все потребители.
- HTTP порты MS — для health/internal; бизнес-API через них не открывать наружу.
