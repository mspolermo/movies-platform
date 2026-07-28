# Единый бэклог (FE / BE / Infra)

Источники: бывшие `technical-debt.md` + `old-client-migration-gaps.md` (2026-07).  
Канон архитектуры: [`.cursor/architecture.md`](../architecture.md). Канон клиента: только `apps/client` (`old-client/` — legacy, gitignored).

Актуализировать при закрытии пунктов; не дублировать в `architecture.md`.  
Обновлено: 2026-07-28 (F1 Admin FE / ADR-005).

## Легенда

| Priority | Смысл |
|----------|--------|
| **P0** | Критичный риск / продуктовый контракт |
| **P1** | Архитектура, UX-паритет, важные улучшения |
| **P2** | DX / polish / низкий ROI |
| **Skip** | Не делать |

Горизонт: **S** краткосрочно · **M** средне · **L** долгосрочно.

---

## Frontend

### P0 — продукт / auth / admin

| # | Что | Статус | Как | Не делать |
|---|-----|--------|-----|-----------|
| F1 | **Admin CRUD** фильмов/жанров/… | **FE in progress** / BE open | [ADR-005](../adr/005-admin-in-b2c.md): B2C `/admin/*`, FSD `manage*`, stubs; BE `/admin` + RolesGuard (B5) later | Порт DOM/Redux-админки; Bearer из localStorage |
| F2 | **OAuth** Google + VK | open / skip? | Только если продукт требует: gateway OAuth, env client IDs | VK SDK + hardcoded clientId из OLD |
| F3 | **Избранное / bookmark** | open | Backend entity + RPC + `features/toggleFilmFavorite` (← B12). UI stub в `openFilmActions` ок до API | Fake store без пути к API; «вечный» console.log-stub |
| F4 | **Оценка фильма 1–10** | open | User ratings entity (← B11) → заменить `submitFilmGrade` stub в `openFilmActions` | GradeBlock DOM-хаки из OLD |
| F5 | Access token только in-memory | **done** | [ADR-001](../adr/001-jwt-access-opaque-refresh.md); hard reload → bootstrap/refresh | JWT в `localStorage` |

### P1 — Film / Home UX

| # | Что | Статус | Как |
|---|-----|--------|-----|
| F6 | Share panel | **done** | в `openFilmActions` ([ADR-004](../adr/004-open-film-actions.md)) |
| F8 | PlayerPanel actions | **done** | card+detail panel в `openFilmActions`; bookmark stub до F3 |
| F12 | Promo / hero | **done** | `widgets/PromoBannerSlider` ([ADR-003](../adr/003-home-promo-banner-slider.md)) |

### P2 — DX

| # | Что | Статус | Как |
|---|-----|--------|-----|
| F13 | i18n | open | next-intl / аналог; LanguageSwitcher |
| F14 | Client tests | **partial** | `shared/ui` kit: поведенческие + a11y-контракт (Modal/Overlay/Input/Tooltip/…); дальше — smoke auth/filters/comments |
| F15 | Storybook | **partial** | kit stories densified (Button/Input/Skeleton/Card/SortFilter); дальше — argTypes у оставшегося kit |
| F16 | E2E Playwright | open | login → profile → logout |
| F17 | Удалить `old-client/` | open | локальная папка gitignored; снести диск + доки/ссылки после закрытия нужных P0 |

---

## Backend

### P0 — критичный

| # | Проблема | Где | Риск / действие |
|---|----------|-----|-----------------|
| B1 | `synchronize: true` | `auth-users`, `kino-db` | Потеря схемы в prod → миграции Sequelize (**S**) |
| B2 | `has_session` не HttpOnly | gateway cookie | UX-хинт; подделка = ложный proxy-redirect |

### P1 — архитектура / контракты

| # | Проблема | Детали | Горизонт |
|---|----------|--------|----------|
| B3 | Синхронный RMQ RPC | Нет timeout/retry/circuit breaker | **M**: timeout, retry, DLQ, correlation id |
| B4 | Два HTTP-порта у МС | auth-users/kino-db: HTTP ≈ только health | — |
| B5 | `UserRolesModule` / RolesGuard | RBAC по сути не используется | **M**: проводка или deprecate |
| B6 | Orphan RPC | `outRegistration`, `createRole` — нет gateway-клиента | **M** |
| B7 | TODO комментарии / professionId / PersonProfession A/B | `kino-db.rpc.ts`, DTO, model | **S** |
| B8 | `GET /auth/checkToken` deprecated | удалить после миграции потребителей | **S** |
| B9 | Слабое покрытие gateway | только films specs | **S–M** |
| B10 | Event-driven write-side | `@EventPattern` | **L** |
| B11 | User ratings как сущность | нужно для F4 | **L** (блокер ratings UI) |
| B12 | Favorites entity + RPC | нужно для F3 | **M–L** |

### Возможные улучшения

| # | Что | Горизонт |
|---|-----|----------|
| B14 | Кэш справочников (Redis / CDN) | **M** |
| B15 | Observability (logs, metrics) | **M** |

---

## Infra

| # | Проблема | Детали | Горизонт |
|---|----------|--------|----------|
| I1 | Client не в docker-compose | Ручной запуск | **S** |
| I2 | `sleep 15` в compose | Костыль ожидания зависимостей | **S** |
| I3 | Graceful shutdown workers | `process.exit` без `app.close()` | **S** |
| I4 | Нет CI (GitHub Actions) | — | **S–M** |
| I5 | auth-users `/health` | без реального DB check | **S** |
| I6 | Отдельные `node_modules` / lockfile | client vs backend | **L**: workspaces по необходимости |

---

## Рекомендуемый порядок

```
1. B1 миграции вместо synchronize          (P0 infra/BE)
2. ADR: admin? OAuth?                      (F1/F2)
3. Favorites + ratings: API                (F3/F4 ← B11/B12)
4. Admin на RBAC (если да)                 (F1 ← B5)
5. ~~Film UX: share / panel (F6, F8)~~     done — ADR-004
6. I1 client в compose · F14 smoke · F16 E2E
7. B3 RMQ resilience · B14/B15 observability
8. F17 удалить old-client/ (локально + ссылки)
```

---

## Чеклист статуса

### Frontend
- [ ] F1 Admin — FE in progress ([ADR-005](../adr/005-admin-in-b2c.md)); BE open
- [ ] F2 OAuth (или skip)
- [ ] F3 Favorites API (UI stub в `openFilmActions` — временно ок)
- [ ] F4 Ratings API (вместо `submitFilmGrade` stub)
- [x] F5 Access token in-memory — done ([ADR-001](../adr/001-jwt-access-opaque-refresh.md))
- [x] F6 Share — done (`openFilmActions`, [ADR-004](../adr/004-open-film-actions.md))
- [x] F8 Panel actions — done (`openFilmActions`, favorite stub)
- [x] F12 Promo — done ([ADR-003](../adr/003-home-promo-banner-slider.md))
- [x] Nested comments — **не делаем** ([ADR-002](../adr/002-flat-film-reviews.md))
- [x] F7 / F9 / F10 / F11 — **не делаем** (fullscreen trailer, tab-shell, Top-N, mega-menus)
- [ ] F13 i18n
- [ ] F14 Client tests — **partial** (setup + utils; нужны smoke)
- [x] F15 Storybook
- [ ] F16 E2E Playwright
- [ ] F17 Remove `old-client/` (есть локально, в git уже ignore)

### Backend / Infra
- [ ] B1 Sequelize migrations
- [ ] B3 RMQ timeout/retry/DLQ
- [ ] B5/B6 RBAC / orphan RPC
- [ ] B8 удалить checkToken
- [ ] B11/B12 ratings + favorites entities
- [ ] I1 Client в compose
- [ ] I4 CI
