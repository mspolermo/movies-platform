# Deployment Rules

## Локальный стенд

```bash
# backend + db + rabbitmq + seed
docker compose up -d --build

# frontend отдельно
cd apps/client && npm install && npm run dev
```

- Env: скопировать `.env.example` → `.env` (не коммитить `.env`).
- Полный reset kino-данных: `docker compose down -v` затем up.

## Сервисы Compose

| Service | Назначение |
|---------|------------|
| api-gateway | HTTP :5001 |
| auth-users | RMQ users + HTTP health :3001 |
| kino-db | RMQ films + HTTP health :3002 |
| kino-db-seed | one-shot seed после старта kino-db |
| db / db2 | Postgres 15 |
| rabbitmq | AMQP + management :15672 |
| pgadmin | :5050 |

Client в compose **не** включён.

## Nest bootstrap

- Gateway: HTTP only + ValidationPipe + Swagger + filters/guards.
- MS: `connectMicroservice(RMQ)` + `startAllMicroservices` + HTTP listen (health).
- Очередь задаётся env `USERS_QUEUE` / `FILMS_QUEUE`.

## Health / restart

- Docker `healthcheck` curl на `/health`.
- `restart: unless-stopped` у долгоживущих сервисов; seed — `restart: no`.
- Graceful: gateway — `app.close()` на SIGTERM; workers — сейчас `process.exit` без `app.close()` (чинить при касании).
- Health: kino-db проверяет БД; auth-users HTTP health — без реального DB check; gateway `/health` пингует RMQ, status часто `"ok"` даже при disconnected.

## CI

- GitHub Actions в репозитории **нет**.
- Перед merge локально: lint + test (backend `npm test`, client `npm run lint` / `type-check`).
- Не мержить с красным eslint (`--max-warnings 0`).

## Prod-готовность (инварианты)

- Не оставлять `synchronize: true` как единственный способ схемы.
- Секреты и `ALLOWED_ORIGINS` задавать явно.
- Не публиковать порты MS/Rabbit/Postgres без необходимости.
- Breaking RPC — деплой gateway + MS вместе (монорепа).
