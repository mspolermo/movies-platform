# План очистки мёртвого кода (backend / gateway)

**Источник:** [IMPORTANT - backend-architecture-audit.md](./IMPORTANT%20-%20backend-architecture-audit.md) (2026-08-02)  
**Scope:** в основном `apps/api-gateway` + точечно compose/env.  
**Не удалять:** `favorites.remove` RPC (internal orphan-cleanup, ADR-008).  
**Бэклог:** **B32**.

Горизонт: **S** = один PR / ≤1d.

**Сделано (Wave 1):** D1–D6.  
**Снято:** D12 — `AppController` удалён в **B22**.  
**Сделано (Wave 2):** D7 `checkToken` удалён; D8 ложный `CountryResponseDto` → `CountryItemResponseDto` (= `TCountryItemResponse`); genres/persons/filters/search/professions/films/comments/auth — response DTOs + typed `@ApiOkResponse` (`FilmListItemResponseDto` в `films/dto`, search реиспользует); D9 — class `JwtAuthGuard` + method `@Public`; `JwtConfigModule` `@Global()` (лишние imports из feature-модулей сняты). `@ApiBearerAuth` только на JWT-required (не на `@Public` catalog). Strip `@Public` отклонён (мина под APP_GUARD / B38).

---

## Wave 3 — мёртвые ветки / шум (остаток B32)

| # | Что | Путь | Действие |
|---|-----|------|----------|
| D10 | `console.log` в guards | `jwt-auth.guard.ts`, `roles.guard.ts` | Nest `Logger`; не логировать email на success |
| D11 | Мёртвая ветка `if (!this.jwtService)` | `jwt-auth.guard.ts` | Удалить невозможную ветку при DI |
| D13 | Почти мёртвая ветка `!user?.email` в comments | `comments.service.ts` | После `fromRpc` — осмысленный 404; убрать dead branch |

**DoD Wave 3:** логичный попутный cleanup с **B24**/S-05–S-06 (fromRpc / filter).

---

## Явно НЕ удалять

| Item | Почему |
|------|--------|
| `FavoritesClient.remove` / RPC `favorites.remove` | Orphan cleanup при 404 фильма (ADR-008) |
| `GET /genres`, `/countries` рядом с `/filters` | Два канала (raw vs BFF labels), оба живые |
| `UserRolesService` | Нужен RolesGuard |
| Thin `Admin*Service` | Паттерн ADR-007, не dead layer |
| Auth phrase-match helpers | Сначала заменить на `fromRpc`/statusCode (**B24**), потом удалить |
| `@Public` на публичных роутах | Intent markers до global Jwt (**B38** / `security.md`) |

---

## Порядок исполнения

```
1. Wave 3 (D10–D11, D13) вместе с B24 / S-05–S-06
```

Чеклист:

- [x] D1–D6 Wave 1 (done)
- [x] D12 app.controller health ping (снято — B22)
- [x] D7 checkToken
- [x] D8 CountryResponseDto → CountryItemResponseDto (правильный shape)
- [x] D9 Bearer lies + `@Public` markers (strip Public cancelled)
- [ ] D10–D11, D13 noise/branches
