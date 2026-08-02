# Infrastructure Audit

**Дата:** 2026-08-02  
**Стек:** Docker Compose · Nest monorepo (api-gateway / auth-users / kino-db) · Next client (отдельный npm) · PG×2 · RabbitMQ · seed `devops/`  
**Lens:** MVP с claim на production-habits · оси **local-DX** (laptop) / **edge-compose** (тот же compose на VPS/LAN)  
**Empirical:** `docker compose config` OK; stack ~2d up; `docker stop rabbitmq` → GW `/health` всё ещё HTTP 200 `status:ok`; prod image `mp-gw:audit` — CMD path OK, `ENV PORT` нет, HEALTHCHECK ломается  

Пересечения с BE-аудитом: **S-01…S-03, S-07, S-09, S-10** → backlog **B20–B22, B26, B28, B29**; schema → **B1**. Ниже — infra-собственное + verify.

---

## 1. Вердикт

### ~3.5/10 weighted · local-DX ~5.5 · edge-compose ~2

Сильное: валидный compose; infra `depends_on`+health для PG/RMQ; Nest+webpack `@common` собирается; seed historically exit 0; docs честно: client отдельно, CI нет.

Слабое @edge: full publish + guest/weak secrets; false-green health; нет named volumes / migrations; нет CI и prod overlay; prod HEALTHCHECK без `PORT`.

| Ось | Вес | Score |
|-----|-----|-------|
| Security & exposure | 0.20 | 2.5 |
| Data + persistence | 0.20 | 3 |
| Compose / health / cold-start | 0.15 | 4 |
| Env & secrets | 0.15 | 3.5 |
| Images | 0.10 | 4 |
| Monorepo tooling | 0.10 | 6 |
| CI / overlay / ops | 0.10 | 2.5 |
| **Weighted** | | **~3.5** |

**Threat model:** внутри docker bridge = trusted; host-published ports = untrusted. Не оценивали k8s/helm (ceiling = compose до отдельного ADR).

---

## 2. Inventory (факт)

| Есть | Нет |
|------|-----|
| compose: gateway, auth-users, kino-db, kino-db-seed, db, db2, rabbitmq, pgadmin | Client в compose / client Dockerfile |
| 3× Dockerfile (почти идентичны), target development в compose | `.github/`, `compose.prod.yml`, profiles |
| Dual npm: root Nest + `apps/client` | Named volumes в compose.yml |
| Seed kino ~13MB SQL + users initdb dump | nx/turbo/helm/k8s |
| Bind `.` + anon `node_modules` на apps | Resource limits / logging driver / `init` / `stop_grace_period` |

**Runtime mounts:** Docker всё же создаёт **anonymous** volumes для PGDATA и `/var/lib/rabbitmq` — данные живут до `down -v`, но в compose нет явного durable contract.

**Ports (host):** `5001` GW · `3001`/`3002` MS · `5432`/`5433` PG · `5672`/`15672` RMQ · `5050` pgadmin — все на `0.0.0.0`.

---

## 3. Findings (канон)

Sev: `P0|P1|P2|P3` @ `local-DX` | `edge-compose` | `both`.

### P0

| ID | Sev@axes | Problem | Evidence | Fix |
|----|----------|---------|----------|-----|
| **S-01** | P0@edge | RMQ publish + `guest`/`guest`; URL без creds в env | compose; `.env.example` | Не publish; creds из env; internal net |
| **S-02** | P0@edge | MS HTTP `3001`/`3002` + CORS `origin:true` | compose; MS `main.ts` | Не publish MS; HTTP только health/loopback |
| **S-03** | P0@both | `/health` → 200 `ok` при dead RMQ; compose `curl -f` = false-green | **empirical probe** | Readiness 503; HC на readiness |
| **INF-40** | P0@edge | PG `root`/`root` в `.env.example` | example | Strong secrets; force-change |
| **INF-51** | P0@edge / P1@local | Нет **named** volumes — только anon | compose; inspect | `pg_kino` / `pg_users` / `rmq_data` |
| **INF-53** | P0@edge | Schema = `synchronize: true` only (=B1) | app.module ×2 | Migrations; sync off @edge |
| **INF-70** | P0@edge | PG `5432`/`5433` на host | compose | No host publish @edge |
| **INF-71** | P0@edge | pgadmin `:5050` + plaintext admin | compose | `profiles: [tools]`; no publish @edge |
| **INF-85** | P0@edge | Нет prod overlay / `compose.prod` | I0 | Overlay: strip publish, no bind, `target:production` |

### P1

| ID | Sev@axes | Problem | Fix |
|----|----------|---------|-----|
| **S-07** | P1@edge | Swagger всегда on | `SWAGGER_ENABLED` (=B26) |
| **S-09** | P1@edge | HEALTHCHECK `${PORT}` без `ENV PORT` (**empirical**) | `ENV PORT` ×3 Dockerfile (=B28) |
| **S-10** | P1@local-DX | GW `depends_on` только rabbit | depends_on MS healthy **или** S-03 (=B29) |
| **I2** | P1@local-DX | `sleep 15` ×3 | Убрать; healthy + `start_period` |
| **INF-01** | P1@both | Compose HC без `start_period`; вместе с S-03 оркестратор врёт | HC readiness + start_period |
| **INF-02** | P1@local-DX | Seed: `kino-db:started` ≠ healthy | `service_healthy` + schema poll (уже в script) |
| **INF-03** | P1@edge | Одна bridge; нет `internal` для data plane | Internal net db+rmq (+MS) |
| **INF-10** | P1@edge | Containers as root | non-root USER |
| **INF-20** | P1@local-DX | `npm run start:prod` → `dist/main` (нет файла) | `dist/apps/$APP/main` |
| **INF-41** | P1@edge | pgadmin creds hardcoded (не в env) | env + profiles |
| **INF-42** | P1@edge | JWT placeholder + `DEV_SECRET` если пусто @non-prod | Fail-fast placeholder; no DEV_SECRET @edge |
| **INF-43** | P1@edge | Secrets только `.env`; нет rotation/CI inject | Runbook + CI secrets |
| **INF-44** | P1@edge | CORS/OriginGuard open пока `NODE_ENV≠production` | Always allowlist / `STRICT_ORIGINS` |
| **INF-56** | P1@local-DX | Docs: `down -v` = «kino» — врёт (kino+users+rmq) | Doc per-volume blast |
| **INF-57** | P1@edge | Нет backup/restore runbook | `pg_dump` sample + named vols |
| **INF-58** | P1@edge | Default ADMIN в SQL + password в comment | Local-only; change @edge |
| **INF-72** | P1@edge | Нет TLS termination story | Caddy/Traefik в overlay |
| **INF-74** | P1@edge | Bind-mount репо @edge = FS→container surface | Prod без bind |
| **INF-86** / **I3** | P1@both | Workers: SIGTERM → `process.exit` без `app.close()` | `enableShutdownHooks` + close |
| **INF-87** | P1@both | Нет `init: true` / `stop_grace_period` | Добавить в compose |
| **INF-80** / **I4** | P1@both | Нет GitHub Actions / merge gate | GHA: lint/test/build root+client |
| **INF-81** | P1@both | Hook ≠ enforced CI | Required checks |
| **INF-91** | P1@edge | Нет SHA-tag ship GW+MS вместе | Registry `:gitsha` ×3 |

### P2 / P3 (сжато)

| ID | Sev | Problem |
|----|-----|---------|
| **I1** | P2@local | Client не в compose (документировано; optional profile) |
| **I6** | P2@both | Dual lockfile / node_modules (horizon L) |
| **INF-04** | P2@local | Нет compose `profiles` (pgadmin/seed always on) |
| **INF-08/14** | P2 | Floating image tags / no digests |
| **INF-11** | P2 | Double `npm ci` в Dockerfile |
| **INF-12** | P2 | `.dockerignore` не режет client/seed/`.cursor` |
| **INF-13** | P2@edge | Prod `COPY . .` — исходники в runtime image |
| **INF-15** | P2@local | Dev target + bind: image build source почти бесполезен |
| **INF-21…26** | P3 | dead `libs/**` format; Jest roots; bare `nest build`; stale lock engines |
| **INF-45…50** | P2–P3 | ALLOWED_ORIGINS drift; missing knobs; env_file∩environment noise |
| **INF-52/54/55/59/64** | P2 | Dual bootstrap kino vs users; seed race mitigated; skip-if-Film; partial reset; seed size |
| **INF-60/62/63** | P2–P3 | No one-command stack; hook≠CI; `@common` path-only (type-only OK) |
| **INF-73** | P2@edge | Plain AMQP in bridge (OK@local) |
| **INF-77** | P1/P3 | Swagger на том же publish что B2C (=S-07) |
| **INF-82–84** | P2 | engines not enforced; no Dependabot; no image publish |
| **INF-88–90** | P2 | No resource limits; unstructured logs; Mac bind/watch cost |
| **INF-92/93** | P2–P3 | Ops runbook pointer; no off-compose path |

---

## 4. Empirical

| Probe | Result |
|-------|--------|
| `docker compose config` | exit 0 |
| Stack | Up ~2d (cold-start wall-clock **UNVERIFIED**) |
| `:5001/health` baseline | 200, RMQ connected |
| Stop rabbitmq → GW health | **200** `status:ok`, queues `disconnected` |
| Prod build gateway | OK; `dist/apps/api-gateway/main.js` есть; **PORT unset**; HC → `localhost:/health` |
| PG/RMQ mounts | anonymous volumes |
| `kino-db-seed` | Exited (0) historically |

---

## 5. OK

- Infra depends_on healthy (db/db2/rabbit → apps) — паттерн верный (ломают sleep + S-10 + seed `started`)
- PG/RMQ healthchecks адекватны как accept-conn
- Seed `restart: no`; script polls schema + skip-if-Film
- Prod CMD path совпадает с nest/webpack out
- Client `@common/types` type-only + turbopack root — работает
- Docs про client/CI — без вранья (кроме blast radius `down -v`)

---

## 6. Wave plan → backlog Infra

| Wave | Фокус | Backlog |
|------|-------|---------|
| A | Overlay + publish strip + named vols + readiness + ENV PORT | I7, I8, I13 + B20–B22, B28 |
| B | Secrets/env hygiene + swagger + admin seed | I14–I16 + B26; B1 |
| C | DX compose: sleep, depends, seed healthy, docs blast, graceful | I2, I3, I17 + B29 |
| D | CI + images (dockerignore, non-root, start:prod) | I4, I10–I12 |
| E | Dual lock, backup, client profile, registry SHA | I1, I6, I9, I18 |

Детальный исполняемый список: [`.cursor/temp/backlog.md`](./backlog.md) § Infra.
