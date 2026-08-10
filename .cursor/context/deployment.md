# Deployment Rules

## Локальный стенд

```bash
cp .env.example .env
# COMPOSE_ENV_FILES=./devops/network.env,.env

npm run compose:up   # -d --build; foreground: compose:up:fg

# frontend отдельно
cd apps/client && npm install && npm run dev
```

- Топология: [`devops/network.env`](../../devops/network.env) + [`network.ts`](../../apps/common/constants/network.ts) / [`network.rmq.ts`](../../apps/common/constants/network.rmq.ts). Secrets — root `.env`. См. [`devops/README.md`](../../devops/README.md), [ADR-009](../adr/009-compose-port-topology.md).
- **Host-run Nest:** `RABBITMQ_URL` / очереди из constants (или override в `.env`); DX fallback только non-prod. **App-контейнеры:** compose собирает `amqp://…@rabbitmq:…` — не прокидывать host URL.
- Compose defaults RMQ: `mp` / `mp_dev_change_me` если `RABBITMQ_USER`/`PASS` пустые.
- **Смена RMQ / PG user/pass:** образ пишет пользователя только при **первом** init volume. После смены creds — пересоздать volume (`docker compose rm -sf rabbitmq` + `down` volume / `down -v` осторожно) затем `up`. Immutability: смена пароля в `.env` без recreate volume **не** обновит уже инициализированный Postgres/RMQ. Example: `POSTGRES_USER=mp_dev` — старые volumes на `root` несовместимы без wipe.
- Named volumes: `pg_kino`, `pg_users`, `rmq_data`. `down -v` сносит все три.
- Publish bind: `BIND_HOST=127.0.0.1` (I7 **partial** — не strip). Один compose = local DX; prod overlay — отдельно.
- PgAdmin: `profiles: [tools]` (`COMPOSE_PROFILES=tools`). Seed всегда on.

## Сервисы Compose

| Service | Назначение |
|---------|------------|
| api-gateway | HTTP :5001 (`127.0.0.1`) |
| auth-users | RMQ users + HTTP health :3001 |
| kino-db | RMQ films + HTTP health :3002 |
| kino-db-seed | one-shot seed (всегда) |
| db / db2 | Postgres 15 → vols `pg_kino` / `pg_users` |
| rabbitmq | AMQP + management → `rmq_data` |
| pgadmin | :5050, profile `tools` |

Client в compose **не** включён.

## Nest bootstrap

- Gateway: HTTP + ValidationPipe + Swagger **только если** `NODE_ENV !== "production"` + filters/guards.
- MS: `connectMicroservice(RMQ)` + `startAllMicroservices` + HTTP listen (только `/health`; без CORS).
- Очереди: env или fallback `USERS_QUEUE` / `FILMS_QUEUE` из `@common/constants/network.rmq`.
- RMQ URL: compose → `@rabbitmq`; host-run → constant/`process.env` (DX default только non-prod); production запрещает `guest` и DX-креды (`rmq.factory`).

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
