# Deployment Rules

## Локальный стенд

```bash
# backend + db + rabbitmq + seed
docker compose up -d --build

# frontend отдельно
cd apps/client && npm install && npm run dev
```

- Env: скопировать `.env.example` → `.env` (не коммитить `.env`).
- Обязательны `RABBITMQ_USER` / `RABBITMQ_PASS` и literal `RABBITMQ_URL` для host-run (ConfigModule не expand'ит `${VAR}`). Compose подставляет defaults `mp` / `mp_dev_change_me`, если var пустые.
- **Смена RMQ user/pass:** образ rabbitmq пишет пользователя только при первом init. После перехода с `guest` → `mp` пересоздай брокер: `docker compose rm -sf rabbitmq` (и volume брокера, если был named/anonymous с старыми данными), затем `up -d`.
- Полный reset kino-данных: `docker compose down -v` затем up.
- Один compose-файл: [`docker-compose.yml`](../../docker-compose.yml) (local DX). Отдельного prod overlay нет — edge publish/strip = **I7**, когда понадобится.

## Сервисы Compose

| Service | Назначение |
|---------|------------|
| api-gateway | HTTP :5001 |
| auth-users | RMQ users + HTTP health :3001 (local publish) |
| kino-db | RMQ films + HTTP health :3002 (local publish) |
| kino-db-seed | one-shot seed после старта kino-db |
| db / db2 | Postgres 15 |
| rabbitmq | AMQP + management :15672 (local) |
| pgadmin | :5050 |

Client в compose **не** включён.

## Nest bootstrap

- Gateway: HTTP only + ValidationPipe + Swagger + filters/guards.
- MS: `connectMicroservice(RMQ)` + `startAllMicroservices` + HTTP listen (только `/health`; без CORS).
- Очередь задаётся env `USERS_QUEUE` / `FILMS_QUEUE`.
- RMQ URL: compose задаёт `amqp://user:pass@rabbitmq:5672`; production запрещает user `guest` (`rmq.factory`).

## Health / restart

| Endpoint | Семантика |
|----------|-----------|
| GW `GET /health/live` | liveness — процесс жив |
| GW `GET /health` | readiness — RPC `health.ping` users+films (каждый ping = DB authenticate); **503** если любой down |
| MS `GET /health` | DB `authenticate`; 503 если down |

- Docker HC: curl `/health` (ready); `start_period: 120s` на GW и MS.
- GW `depends_on` auth-users + kino-db + rabbitmq (`service_healthy`) — **только порядок старта**; runtime падение MS → readiness 503, Compose GW сам не гасит.
- Body ready: `{ status, timestamp, service, dependencies: { users, films } }`.
- `restart: unless-stopped` у долгоживущих; seed — `restart: no`.
- Graceful: gateway — `app.close()` на SIGTERM; workers — сейчас `process.exit` без `app.close()` (чинить при касании).

## CI

- GitHub Actions в репозитории **нет**.
- Перед merge локально: lint + test (backend `npm test`, client `npm run lint` / `type-check`).
- Не мержить с красным eslint (`--max-warnings 0`).

## Prod-готовность (инварианты)

- Не оставлять `synchronize: true` как единственный способ схемы.
- Секреты и `ALLOWED_ORIGINS` задавать явно; RMQ не `guest` @production.
- Не публиковать порты MS/Rabbit/Postgres на edge без необходимости (сейчас local compose публикует для DX; strip @edge — **I7**).
- Breaking RPC — деплой gateway + MS вместе (монорепа).
