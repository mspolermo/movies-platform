# DevOps / локальная топология

## Сеть: два файла, одни цифры

| Файл | Роль |
|------|------|
| [`apps/common/constants/network.ts`](../apps/common/constants/network.ts) | Публичная топология (порты, `API_GATEWAY_URL`, origin) — Nest / Next / client |
| [`apps/common/constants/network.rmq.ts`](../apps/common/constants/network.rmq.ts) | RMQ DX URL/creds/очереди — **backend-only** |
| [`devops/network.env`](./network.env) | Зеркало для **Compose** (`COMPOSE_ENV_FILES` / `--env-file`) |

Меняешь порт, URL, очереди — **ts (+ rmq) и env** в одном PR. Drift ловит sync-тест (`apps/api-gateway/src/health/tests/network.sync.spec.ts`).

## Secrets — не сюда

В `network.env` только топология (и DX host-run `RABBITMQ_URL`).  
JWT, PG password, `RABBITMQ_USER` / `RABBITMQ_PASS` — root [`.env`](../.env) (шаблон [`.env.example`](../.env.example)).

## RabbitMQ: host vs Docker

- **Host-run Nest:** `RABBITMQ_URL` из `network.rmq` → `…@localhost:5672` (DX fallback только при `NODE_ENV !== production`).
- **Контейнеры apps:** compose **собирает** `amqp://user:pass@rabbitmq:5672` — не подставляй host `RABBITMQ_URL` в сервисы (иначе `localhost` внутри контейнера).
- **Production:** без env — fail-fast; DX-креды `mp` / `mp_dev_change_me` запрещены (`rmq.factory`).

## Быстрый старт

```bash
cp .env.example .env
# в .env должна быть строка:
# COMPOSE_ENV_FILES=./devops/network.env,.env

npm run compose:config   # проверить интерполяцию
npm run compose:up       # -d --build
# foreground: npm run compose:up:fg
```

Без `COMPOSE_ENV_FILES` / `--env-file` compose всё равно поднимется: в `docker-compose.yml` есть `:-defaults`, совпадающие с `network.ts`.  
`network.env` нужен как единый knob (не дублировать цифры в YAML вручную).

Альтернатива без `COMPOSE_ENV_FILES` в `.env`:

```bash
docker compose --env-file devops/network.env --env-file .env up -d --build
```

## Postgres / RMQ creds и volumes

`.env.example` → `POSTGRES_USER=mp_dev` (не `root`).  
Образ Postgres/RabbitMQ пишет пользователя **только при первом init volume**.  
Если уже поднимал стенд со старыми creds (`root` / `guest`) — либо оставь старые в своём `.env`, либо:

```bash
npm run compose:down -- -v   # сносит pg_kino, pg_users, rmq_data
npm run compose:up
```

## PgAdmin

Сервис `pgadmin` под profile `tools`:

```bash
# в .env раскомментировать:
# COMPOSE_PROFILES=tools
```
