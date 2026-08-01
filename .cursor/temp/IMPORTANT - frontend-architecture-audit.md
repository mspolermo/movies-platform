# Архитектурный аудит: `apps/client`

**Дата:** 2026-07-31 (замена аудита 2026-07-19)  
**Стек:** Next 16 · React 19 · TypeScript strict · FSD · axios · zustand · Vitest · Storybook 10  
**Critical:** 0 · **High (unique):** 29 · **Уровень:** Strong Middle · **Weighted:** ~6.2/10

Детальные wave-отчёты (01–16) **не канон** и в MR не нести — только этот файл + [`backlog.md`](./backlog.md).

---

## Вердикт

FSD-boundaries и ADR-001/003/004/007/008 на каркасе живые: composition root `Auth → Favorite → FilmActions`, admin на реальном API, compact favorites/ratings wired, тесты/Storybook появились. Ниже Senior: multi-tab refresh → revoke-all, prefs tab-local + O(n) context, каталог без RSC-seed / URL-расползание, 500≡404/empty, Page/provider tax, LIST профиля мёртв, a11y pointer-only на card/filters/header.

---

## Scorecard

| Критерий | 19.07 | 31.07 | Note |
|----------|------:|------:|------|
| Architecture / FSD | 7 | **7.0** | get*, thin widgets, Page client — still |
| State & data flow | — | **6.5** | prefs Set/Map; URL filters dual SoT |
| Types & API | 8 | **8.0** | FAVORITES/RATINGS path OK; LIST orphan |
| Auth & FE security | — | **8.0** | ADR-001 ок; multi-tab race High |
| React / Next | 7 | **5.5** | error masking, loading gaps, client shells |
| UI kit | — | **6.0** | SvgIcon эталон; junior Card |
| Styles / tokens | — | **5.0** | dual font; bp drift; L/M forks |
| A11y | — | **4.5** | hover-only overlays/menus |
| Tests / tooling | 0 tests | **5.0** | kit/session ок; domain gap |
| Perf / bundle | 6 | **4.5** | root prefs tax; 0 dynamic; no catalog seed |
| Maintainability | 7 | **5.5** | barrels↑; filterFilms obesity |

**Weighted avg ≈ 6.2/10** (веса: Arch/State/Auth 1.5; Types/React 1.2; Tests/Perf 1.0; UI/A11y/Maint 0.8; Styles 0.7).

---

## Delta vs 2026-07-19

### Fixed
- Pagination → `usePaginatedResource`
- Fake favorite/rate → compact hydrate + mutate (ADR-008)
- ProfessionsPage deep import → public barrel
- Admin stubs → real `API_ENDPOINTS.ADMIN` (ADR-007; dashboard copy still stub-era)
- Tests/Storybook: 0 → ~41 tests + kit stories; SvgIcon эталон
- `getApiErrorMessage`; auth ближе ADR-001

### Still open (carry)
- `get*` features ≠ use-cases; thin `FilmCommentsViewer`; PersonDetail→entity SCSS; Page `'use client'`; over-sliced features; auth facade blur; junior Card; barrel tax; нет RQ/Data Cache (осознанно)

### New (31.07) — см. Top-20 / backlog

---

## Top-20 tech debt

| # | ID | Symptom | Effort | Blast |
|--:|----|---------|:------:|-------|
| 1 | F-03-01 | Multi-tab refresh без lock → BE reuse → revoke-all | M | session |
| 2 | F-04-01 | Prefs Set/Map tab-local, нет invalidation | M | favorites/ratings |
| 3 | F-07-01 | Monolithic prefs context → O(n) panels | M | FilmActionsPanel |
| 4 | F-15-01 | Favorite+Actions на всех routes (вкл. login) | M | AppProviders |
| 5 | F-06-01 | API `catch→null` → `notFound()` (500≡404) | S | films/professions |
| 6 | F-06-02 | Client fetch catch → empty (500≡empty) | S | search/creators |
| 7 | F-10-01 | Header `url: 'professions'` без `/` | S | nav |
| 8 | F-08-01 | URL dual mirror + quick writer | L | filterFilms |
| 9 | F-08-02 | Каталог без `initialData` | M | `/films` |
| 10 | F-15-05 | `Page` `'use client'` ~25 pages | M | chrome |
| 11 | F-12-01 | LIST prefs 0 callers; profile stub | M | Profile |
| 12 | F-12-02 | LIST без enrich → нельзя FilmCard | L | gateway+profile |
| 13 | F-15-04 | FilmDetail monolithic client + waterfalls | L | detail |
| 14 | F-06-03 | Нет loading home/search/profile/admin | S | routes |
| 15 | F-01-02 | Widget → entity `.module.scss` | S | PersonDetail |
| 16 | F-08-03 | filterFilms ~63 / L·M·T SCSS forks | L | filters |
| 17 | F-16-01 | Card actions только `:hover` | M | FilmCard |
| 18 | F-13-01 | Inter vs IvySans dual (~564KB) | S | fonts |
| 19 | F-14-01 | Junior Card + PersonCard fork | M | shared/ui |
| 20 | F-05-01 | 0 tests favorites/filters/pages | M | domain |

Прочие High (не top-20): F-09-01 dashboard stub copy · F-11-04 IPTV в prod nav · F-13-02 bp drift · F-14-02 SortFilter/AdminCrudList в kit · F-16-02..05 nested button / FilterDropdown / HeaderDropdown / srOnly errors.

---

## Fix order

1. **Security** — F-03-01 (BroadcastChannel / cross-tab refresh lock); F-10-01 (`/professions`)
2. **State / ADR-008** — F-04-01 → F-07-01 → F-12-01/02 → F-08-01
3. **FSD** — F-01-02 → F-15-05 → F-08-03 → F-01-01 rename `get*`
4. **Perf** — F-15-01 route-scoped providers → F-08-02 seed → F-06-03 loadings → F-15-04 → F-13-01
5. **Kit / a11y / tests** — F-16-* → F-14-* → F-05-01; F-06-01/02 параллельно (S)

Трекер исполнения: [`backlog.md`](./backlog.md) § Frontend (аудит 31.07).
