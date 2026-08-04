# План очистки мёртвого кода (backend / gateway)

**Источник:** [IMPORTANT - backend-architecture-audit.md](./IMPORTANT%20-%20backend-architecture-audit.md) (2026-08-02)  
**Scope:** в основном `apps/api-gateway` + точечно compose/env. Клиент не трогать, кроме проверки что `/auth/checkToken` не вызывается.  
**Не удалять:** `favorites.remove` RPC (internal orphan-cleanup, ADR-008).

Горизонт: **S** = один PR / ≤1d. Порядок = безопасный → спорный.

---

## Wave 1 — safe deletes (без смены поведения API)

| # | Что | Путь | Проверка | Риск |
|---|-----|------|----------|------|
| D1 | `UserRolesModule` (не импортирован) | `apps/api-gateway/src/user-roles/user-roles.module.ts` (+ re-export из barrel если есть) | Оставить `UserRolesService`; он в `JwtConfigModule` | Низкий |
| D2 | `toAuthResponse` | `auth/helpers/auth-cookie.helper.ts` (+ barrel) | Маппинг уже в `AuthService.mapRpcAuthResponse` | Низкий |
| D3 | `ServiceError` interface | `auth/interfaces/serviceError.interface.ts` (+ barrel) | Grep usage = 0 | Низкий |
| D4 | Compose env noise | `docker-compose.yml` → убрать `JWT_ACCESS_EXPIRES_IN` с **api-gateway** | Оставить на auth-users | Низкий |
| D5 | Мёртвый import Jwt в genres | `genres/genres.module.ts` импорт `JwtConfigModule` без `@UseGuards` | Собрать gateway | Низкий |
| D6 | TODO-комментарий устарел | `professions/dto/profession-persons.param.dto.ts` — TODO «profession→professionId» при уже `professionId` | Починить `@ApiParam` name; удалить TODO | Низкий |

**DoD Wave 1:** `tsc`/lint gateway зелёный; admin RBAC + favorites/ratings specs зелёные.

---

## Wave 2 — deprecated / ложные контракты

| # | Что | Путь | Проверка | Риск |
|---|-----|------|----------|------|
| D7 | `GET /auth/checkToken` | `auth/controllers/auth.controller.ts` + Swagger + `project-index` | Grep client/mobile/docs на `checkToken`; только `/auth/me` | Средний (внешние клиенты?) |
| D8 | `CountryResponseDto` | `countries/dto/response/countryResponse.dto.ts` | Либо удалить + `@ApiOkResponse` от реального shape, либо поля = `TCountryItemResponse` | Средний (только docs) |
| D9 | Noop `@Public()` без Jwt | `FiltersController`, `HealthController` (GW), auth routes без class Jwt | Убрать декоратор **или** повесить Jwt+`@Public` единообразно (предпочтительно catalog unify — отдельная задача B); `AppController` удалён (B22) | Низкий/средний |

**DoD Wave 2:** Swagger countries = runtime JSON; checkToken отсутствует в index.

---

## Wave 3 — мёртвые ветки / шум (не «файлы», а cleanup)

| # | Что | Путь | Действие |
|---|-----|------|----------|
| D10 | `console.log` в guards | `jwt-auth.guard.ts`, `roles.guard.ts` | Nest `Logger`; не логировать email на success |
| D11 | Мёртвая ветка `if (!this.jwtService)` | `jwt-auth.guard.ts` | Удалить невозможную ветку при DI |
| D12 | Дубль health ping | `app.controller.ts` | Один `films` ping + один `users` (не удаление кода ради мёртвого — упрощение) |
| D13 | Почти мёртвая ветка `!user?.email` в comments | `comments.service.ts` | После `fromRpc` — осмысленный 404; убрать dead branch |

---

## Явно НЕ удалять

| Item | Почему |
|------|--------|
| `FavoritesClient.remove` / RPC `favorites.remove` | Orphan cleanup при 404 фильма (ADR-008) |
| `GET /genres`, `/countries` рядом с `/filters` | Два канала (raw vs BFF labels), оба живые |
| `UserRolesService` | Нужен RolesGuard |
| Thin `Admin*Service` | Паттерн ADR-007, не dead layer |
| Auth phrase-match helpers | Сначала заменить на `fromRpc`/statusCode, потом удалить |

---

## Порядок исполнения

```
1. Grep checkToken / toAuthResponse / ServiceError / UserRolesModule / CountryResponseDto
2. Wave 1 PR (D1–D6)
3. Wave 2 PR (D7–D9) — после подтверждения что checkToken не бьёт никто
4. Wave 3 вместе с S-03/S-05/S-06 из backlog (логичный попутный cleanup)
```

Чеклист:

- [ ] D1 UserRolesModule
- [ ] D2 toAuthResponse
- [ ] D3 ServiceError
- [ ] D4 compose JWT_ACCESS_EXPIRES_IN с gateway
- [ ] D5 genres JwtConfigModule import
- [ ] D6 ApiParam/TODO professionId
- [ ] D7 checkToken
- [ ] D8 CountryResponseDto
- [ ] D9 noop @Public
- [ ] D10–D13 noise/branches
