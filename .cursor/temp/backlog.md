# Единый бэклог (FE / BE / Infra)

Канон архитектуры: [`.cursor/architecture.md`](../architecture.md). Канон клиента: `apps/client`.  
Аудит FE: [`IMPORTANT - frontend-architecture-audit.md`](./IMPORTANT%20-%20frontend-architecture-audit.md) (2026-07-31).

Актуализировать при закрытии пунктов; не дублировать в `architecture.md`.  
**Обновлено:** 2026-07-31 — FE перенаполнен из аудита; done убраны из активных таблиц.

## Легенда

| Priority | Смысл |
|----------|--------|
| **P0** | Критичный риск / продуктовый контракт |
| **P1** | Архитектура, UX, важные улучшения |
| **P2** | DX / polish / низкий ROI |
| **Skip** | Не делать |

Горизонт: **S** краткосрочно · **M** средне · **L** долгосрочно.

---

## Frontend — активный (аудит 31.07)

ID `F-xx-yy` = findings аудита. Порядок ≈ fix order из SUMMARY.

### P0 — session / correctness

| # | Что | ID | Горизонт | Как |
|---|-----|-----|:--------:|-----|
| F20 | Cross-tab refresh lock | F-03-01 | **M** | BroadcastChannel / navigator.locks до второго `/auth/refresh`; иначе BE reuse → revoke-all |
| F21 | Prefs cache invalidation | F-04-01 | **M** | focus/visibility refetch compact ids/grades; не держать Set/Map как вечный SoT |
| F22 | API fail ≠ `notFound()` | F-06-01 | **S** | `getFilmsFilters` / `fetchAllProfessionsData`: error UI / error.tsx, не `notFound()` на 500 |
| F23 | Client fetch: error state | F-06-02 | **S** | search / creators / personSearch — не глотать в `[]` |
| F24 | Header «Разделы» absolute URL | F-10-01 | **S** | `url: '/professions'` (и аудит остальных relative) |

### P1 — state / ADR-008 / catalog / perf

| # | Что | ID | Горизонт | Как |
|---|-----|-----|:--------:|-----|
| F25 | Prefs context per-id / split | F-07-01 | **M** | селекторы / split favorite vs rating context — без O(n) всех панелей |
| F26 | Route-scoped film prefs providers | F-15-01 | **M** | не монтировать Favorite+Actions на `/auth/*` (и холодных routes) |
| F27 | Profile LIST prefs UI | F-12-01 | **M** | секции избранного/оценок; вызвать `getMyFavorites` / `getMyFilmRatings` |
| F28 | LIST enrich (film cards) | F-12-02 | **L** | gateway/kino-db enrich или batched film fetch; иначе карточки на профиле невозможны |
| F29 | Filters: один URL writer | F-08-01 | **L** | убрать dual mirror + quick-filters 2nd writer; один serialize/parse |
| F30 | `/films` RSC `initialData` | F-08-02 | **M** | page-1 с сервера в `usePaginatedResource` |
| F31 | RSC `Page` shell | F-15-05 | **M** | BackButton island; убрать `'use client'` с chrome (~25 pages) |
| F32 | FilmDetail split client | F-15-04 | **L** | RSC shell + islands; loading не тянуть полный page module |
| F33 | Route `loading.tsx` parity | F-06-03 | **S** | home, search, profile, auth, admin |
| F34 | Card actions a11y | F-16-01..05 | **M** | focus-within/touch overlay; не `article[role=button]`+nested; FilterDropdown/Header KB; visible errors |
| F35 | PersonDetail SCSS decoupling | F-01-02 | **S** | tokens/props API, не import entity `.module.scss` |
| F36 | Admin dashboard copy | F-09-01 | **S** | убрать «заглушка / HTTP не идёт» после ADR-007 |
| F37 | IPTV out of prod nav | F-11-04 | **S** | спрятать `/tv` или ADR+backend SoT |

### P2 — DX / kit / styles

| # | Что | ID | Горизонт | Как |
|---|-----|-----|:--------:|-----|
| F38 | Domain unit tests | F-05-01 | **M** | FavoriteProvider hydrate/toggle; filter parse/serialize; не page snapshots |
| F39 | filterFilms slim | F-08-03 | **L** | схлопнуть L/T/M SCSS forks где diff = CSS |
| F40 | Font SoT | F-13-01 | **S** | Inter **или** IvySans — не оба |
| F41 | Breakpoints canon | F-13-02 | **M** | только `$bp-mobile`/`$bp-tablet` (650/1160) |
| F42 | Kit: Card / domain composites | F-14-01/02 | **M** | Card→PersonCard path; SortFilter/AdminCrudList не в generic root |
| F43 | Rename `get*` features | F-01-01 | **L** | use-case names; over-slices (`navigateBack`…) в Layout/shared |
| F13 | i18n | — | **L** | next-intl / аналог |
| F16 | E2E Playwright | — | **L** | только с ADR; login→profile→logout |

### Skip

| # | Что | Почему |
|---|-----|--------|
| F2 | OAuth Google/VK | [ADR-006](../adr/006-no-oauth.md) |
| — | Nested comments | [ADR-002](../adr/002-flat-film-reviews.md) |
| — | React Query / E2E без ADR | канон PROJECT_CONTEXT |

---

## Frontend — закрыто (архив, не тащить в работу)

| # | Что | Закрыто |
|---|-----|---------|
| F1 | Admin CRUD B2C | ADR-005 + ADR-007 |
| F3 / F4 | Favorites + ratings compact | ADR-008 (`toggleFilmFavorite`, `openFilmActions`) |
| F5 | Access token in-memory | ADR-001 |
| F6 / F8 | Share + player panel actions | ADR-004 + ADR-008 |
| F12 | Promo / hero | ADR-003 `PromoBannerSlider` |
| F14 / F15 | Vitest + Storybook kit baseline | partial→достаточно kit; дальше = F38 |
| F17 | Удалить `old-client/` | done |
| — | Pagination dupes | `usePaginatedResource` |
| — | Fake favorite UI на карточке | ENT-01 → real prefs |

---

## Backend

### P0

| # | Проблема | Где | Действие |
|---|----------|-----|----------|
| B1 | `synchronize: true` | auth-users, kino-db | Миграции Sequelize (**S**) |
| B2 | `has_session` не HttpOnly | gateway cookie | UX-хинт; не security ([ADR-001](../adr/001-jwt-access-opaque-refresh.md)) |

### P1

| # | Проблема | Горизонт |
|---|----------|----------|
| B3 | RMQ RPC: timeout / retry / DLQ / correlation | **M** |
| B4 | Два HTTP-порта у МС (≈ health) | — |
| B7 | TODO professionId / PersonProfession A/B | **S** |
| B8 | `GET /auth/checkToken` deprecated — удалить | **S** |
| B9 | Слабое покрытие gateway specs | **S–M** |
| B10 | Event-driven write-side | **L** |
| B13 | LIST prefs enrich для профиля (см. F28) | **L** — вместе с F-12-02 |

### Возможные улучшения

| # | Что | Горизонт |
|---|-----|----------|
| B14 | Кэш справочников (Redis / CDN) | **M** |
| B15 | Observability | **M** |

### Backend — закрыто

| # | Что |
|---|-----|
| B5 / B6 | RolesGuard `/admin/*` + orphan `createRole` удалён (ADR-007) |
| B11 / B12 | Ratings + favorites RPC (ADR-008) |

---

## Infra

| # | Проблема | Горизонт |
|---|----------|----------|
| I1 | Client не в docker-compose | **S** |
| I2 | `sleep 15` в compose | **S** |
| I3 | Graceful shutdown workers | **S** |
| I4 | Нет CI (GitHub Actions) | **S–M** |
| I5 | auth-users `/health` без DB check | **S** |
| I6 | Отдельные `node_modules` / lockfile | **L** |

---

## Рекомендуемый порядок

```
1. B1 миграции вместо synchronize
2. F20 cross-tab refresh · F24 nav URL · F22/F23 error parity     (P0 FE, S–M)
3. F21 prefs invalidation · F25 O(n) context · F26 route providers
4. F27/F28 (+B13) profile LIST · F30 films initialData
5. F31 Page RSC · F33 loadings · F34 a11y card/filters
6. F29/F39 filters URL+slim · F32 detail split · F38 domain tests
7. I1 compose · I4 CI · B3 RMQ · B14/B15
```

---

## Чеклист (только open)

### Frontend
- [ ] F20 multi-tab refresh lock
- [ ] F21 prefs invalidation
- [ ] F22/F23 error ≠ empty/404
- [ ] F24 header absolute URLs
- [ ] F25/F26 prefs context + provider scope
- [ ] F27/F28 profile LIST (+ enrich)
- [ ] F29–F33 catalog URL / seed / Page RSC / detail / loadings
- [ ] F34 a11y actions surfaces
- [ ] F35–F37 PersonDetail SCSS / admin copy / IPTV nav
- [ ] F38–F43 DX kit/styles/rename
- [ ] F13 i18n · F16 E2E (с ADR)

### Backend / Infra
- [ ] B1 migrations · B3 RMQ · B8 checkToken · B13 LIST enrich
- [ ] I1 client compose · I4 CI
