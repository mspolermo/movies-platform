# Технический долг

Вынесено из бывшего `docs/PROJECT_ARCHITECTURE.md` (2026-07).  
Канон архитектуры: [`.cursor/architecture.md`](../architecture.md).

Актуализировать при закрытии пунктов; не дублировать в `architecture.md`.

---

## Критичный

| Проблема | Где | Риск |
|----------|-----|------|
| `synchronize: true` | `auth-users`, `kino-db` app.module | Потеря/изменение схемы в prod |
| Access token только in-memory | `shared/api/lib/access-token.ts` | Потеря при hard reload до bootstrap; ок при наличии refresh cookie |
| `has_session` не HttpOnly | gateway cookie | UX-хинт, не security; подделка даёт только ложный proxy-redirect |

---

## Архитектурный

| Проблема | Детали |
|----------|--------|
| Синхронный RMQ request-response | Нет retry, timeout, circuit breaker; блокирующие вызовы |
| Два HTTP-порта у микросервисов | auth-users/kino-db: HTTP почти только health |
| `UserRolesModule` / RolesGuard | RBAC по сути не используется |
| Orphan RPC | `outRegistration`, `createRole` — нет gateway-клиента |
| `old-client/` | Legacy в репозитории; gap/план: [old-client-migration-gaps.md](./old-client-migration-gaps.md) |
| Отдельные `node_modules` | client и backend — разные lockfile |

---

## Код / контракты

| Проблема | Где |
|----------|-----|
| TODO: комментарии | `kino-db.rpc.ts`, comment types |
| TODO: profession → professionId | profession-persons DTO |
| TODO: PersonProfession колонки A/B | `personProfession.model.ts` |
| `GET /auth/checkToken` deprecated | удалить после миграции потребителей |
| Слабое покрытие gateway | только films specs |
| Client / e2e | 0 тестов client; Playwright нет; Vitest setup битый |

---

## Инфраструктура

| Проблема | Детали |
|----------|--------|
| Client не в docker-compose | Ручной запуск |
| `sleep 15` в compose | Костыль ожидания зависимостей |
| Graceful shutdown workers | `process.exit` без `app.close()` |
| Нет CI (GitHub Actions) | — |
| auth-users `/health` | без реального DB check |

---

## Возможные улучшения

### Краткосрочные

1. Миграции Sequelize вместо `synchronize: true`
2. Client в docker-compose
3. Починить Vitest `setupFiles`; smoke-тесты client
4. E2E auth (Playwright) — login → profile → logout

### Среднесрочные

5. RMQ: timeout, retry, DLQ, correlation id
6. Кэш справочников (Redis / CDN)
7. Observability (structured logs, metrics)
8. Проводка или deprecate orphan RPC

### Долгосрочные

9. Event-driven write-side (`@EventPattern`)
10. User ratings как сущность
11. Удалить `old-client/`
12. Единый TS/tooling monorepo (workspaces) — по необходимости
