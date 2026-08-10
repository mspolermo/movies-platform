# 009. Топология портов: network.ts + network.env

- **Статус:** Accepted
- **Дата:** 2026-08-08

## Контекст

Порты и host-URL были размазаны по compose, Nest fallbacks, client SSR и `.env`. Нужен единый канон без runtime-parse `.env` в `apps/common` и без выноса секретов в git-топологию.

## Решение

1. **SoT для кода (публичное):** [`apps/common/constants/network.ts`](../../apps/common/constants/network.ts) — `NETWORK`, `API_GATEWAY_URL`, `CLIENT_ORIGIN` / `ALLOWED_ORIGINS`.
2. **SoT RMQ (backend-only):** [`apps/common/constants/network.rmq.ts`](../../apps/common/constants/network.rmq.ts) — host-run `RABBITMQ_URL`, DX-creds, очереди. Клиент не импортирует (eslint).
3. **Зеркало для Compose:** [`devops/network.env`](../../devops/network.env) + `COMPOSE_ENV_FILES=./devops/network.env,.env`.
4. **Sync-тест** (`apps/api-gateway/src/health/tests/network.sync.spec.ts`) сверяет ts+rmq ↔ env и Dockerfile `ENV PORT` ↔ listen.
5. **I7 @V0:** bind lock `BIND_HOST=127.0.0.1` на publish (не strip / не dual-compose) → backlog **partial**.
6. **Seed** всегда; **pgadmin** — `profiles: [tools]` → I13 **partial**.
7. **Client** value-import: `@common/constants` / `@common/constants/network` (grade, `API_GATEWAY_URL`, `NETWORK`); запрещены JWT, `network.rmq`, dto/orm/entity; запрещён `import *` из constants barrels.
8. Host `RABBITMQ_URL` не прокидывать в app-контейнеры — compose собирает `@rabbitmq:…`. DX URL-fallback в `rmq.factory` только при `NODE_ENV !== production`; prod запрещает `guest` и DX-креды.
9. Root `.env` — только secrets/флаги (JWT, PG, `RABBITMQ_USER`/`PASS`, `COMPOSE_ENV_FILES`).
10. `ALLOWED_ORIGINS` DX-default = `CLIENT_ORIGIN` (`http://localhost:3000`); prod — явный whitelist.

Операционка: [`devops/README.md`](../../devops/README.md).

## Последствия

**Плюсы:** один канон для apps; Compose без магических чисел; client/SSR без локальных `localhost:5001`; RMQ DX-creds не в том же модуле, что тянет браузер.

**Минусы:** dual-edit ts(+rmq)+env; DX-creds в git (`network.rmq` / `network.env`); Dockerfile PORT — третий якорь (в sync-тесте).

## Альтернативы

- Runtime-parse `network.env` в common — отвергнуто (fs, jest, бандл).
- Только литералы в compose без `network.env` — отвергнуто (нет единого knob для YAML).
- Codegen env←ts — отложено (можно позже вместо sync-теста).
- Один файл `network.ts` с RMQ+public — отвергнуто после review (риск утечки DX-creds в client bundle).
