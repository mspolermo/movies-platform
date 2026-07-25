# Gap: `old-client` → `apps/client`

**Дата:** 2026-07-24  
**Источник:** сравнение `old-client/` и `apps/client` vs [`.cursor/context/frontend.md`](../context/frontend.md).  
**Канон:** развивать только `apps/client`. `old-client/` — legacy, не копировать 1:1.

После закрытия пунктов — вычеркнуть / перенести в `technical-debt.md` или удалить файл.  
Связано: [technical-debt.md](./technical-debt.md) п.11 «Удалить old-client/».

---

## Легенда приоритетов

| Priority | Смысл |
|----------|--------|
| **P0** | Продуктовый смысл / контракт; переносить осознанно |
| **P1** | UX паритет film/home; по желанию |
| **P2** | Chrome / DX; низкий ROI или не наш бренд |
| **Skip** | Не переносить |

---

## Переносить

### P0 — домен / auth / admin

#### 1. Admin CRUD фильмов и жанров

| | |
|--|--|
| **Было (OLD)** | `AdminPage` + `FilmBlock` / `GenresBlock`: PATCH/DELETE `localhost:5000`, Bearer из `localStorage`. Роут в `Router.tsx` стоит **после** `path='*'` → фактически мёртвый. |
| **Сейчас (NEW)** | Нет `/admin`, нет admin endpoints в клиенте. |
| **Как** | 1) Решить: нужен ли admin в B2C-клиенте или отдельный admin-app. 2) Если да — `app/admin` + FSD feature `manageFilms` / `manageGenres`, RBAC через gateway (не UI-only `isAdmin`). 3) API только через `shared/api` + `@common/types`; токен — memory access, не localStorage. 4) Не копировать axios из OLD UI. |
| **Не делать** | Порт DOM/Redux-админки as-is. |

#### 2. OAuth Google + VK

| | |
|--|--|
| **Было** | `AuthPage` + `@react-oauth/google` + `VK.Auth.login`; clientId в репо. |
| **Сейчас** | Email/password login/register. |
| **Как** | Только если продукт требует. Gateway OAuth flow (не client-secret во фронте), env-based client IDs, отдельный feature `auth` extensions. Не тащить VK SDK + hardcoded clientId из OLD. |
| **Skip если** | Email auth достаточен. |

---

### P0/P1 — «оба врут»; чинить как продукт, не как миграцию с OLD

Эти фичи в OLD тоже без нормального API. Переносить «как было» бессмысленно — делать правильно.

#### 4. Избранное / bookmark

| | |
|--|--|
| **Было / есть** | Local `useState` / Redux boolean; нет persistence. NEW: `FilmCard` local `isFavorite` + TODO. |
| **Как** | Backend entity + RPC + `features/toggleFilmFavorite`. Убрать fake state из `entities/film/ui`. Пока API нет — скрыть иконки или disabled + tooltip. |

#### 5. Пользовательская оценка фильма (1–10)

| | |
|--|--|
| **Было** | `GradeBlock` + `document.querySelector`, без POST. |
| **Сейчас** | `features/rateFilm` UI ок; `submitFilmGrade` = `console.log` stub. |
| **Как** | User ratings entity (см. technical-debt «долгосрочные» п.10) → заменить stub на API. Не портить GradeBlock DOM-хаки. |

---

### P1 — Film page / UX (по желанию)

| # | Что | Как переносить | Заметка |
|---|-----|----------------|---------|
| 6 | **Share panel** | `features/shareFilm`: Web Share API + copy link; без Redux-флагов | Соцкнопки ivi/fb из OLD — не копировать blindly |
| 7 | **Fullscreen trailer player** | Client island поверх `Trailer`; native `<video>` / dialog | Не возвращать `react-player` без причины |
| 8 | **PlayerPanel actions** | Композиция rate + share + trailer CTA на film detail | Bookmark — только после п.4 |
| 9 | **Tab-shell InternalPage** | Опционально: tabs Создатели / Отзывы / Факты / Трейлеры на detail | Сейчас линейный layout ок; tabs — UX preference, не must |

---

### P1 — Home / chrome (только на своих данных)

| # | Что | Как | Не делать |
|---|-----|-----|-----------|
| 10 | **Promo / hero** | Свой контент (CMS/статика проекта) + RSC carousel | Хардкод баннеров ivi.ru |
| 11 | **Top-N / подборки** | API подборок или curated ids с backend | Статичные картинки Top-10 из OLD |
| 12 | **Header mega-menus** | Свои разделы (`HEADER_SECTIONS`) под реальные роуты | Меню-ссылки на ivi (Series/Mults/Subscribe/Notify) |

---

### P2 — DX / i18n

| # | Что | Как |
|---|-----|-----|
| 13 | **i18n** | next-intl / аналог под App Router; вынести `filtersLocale` и литералы. LanguageSwitcher в header. Не тащить `next-i18next` из CRA. |
| 14 | **Тесты client** | Починить Vitest setup; smoke auth/filters/comments. Не портить shallow OLD suites as-is. |
| 15 | **Storybook** | Опционально для `shared/ui`; не блокер миграции. |

---

## Не переносить (Skip)

| Что в OLD | Почему skip |
|-----------|-------------|
| CRA + `react-router` + Redux boolean bus | Канон: Next App Router, Zustand только user, FSD |
| JWT в `localStorage` | Запрещено `frontend.md`; memory + HttpOnly refresh |
| Axios + `localhost:5000` прямо в компонентах | Только `shared/api` + env |
| `document.querySelector` / classList для модалок | React state |
| Мёртвый порядок роутов (`*` перед admin/auth) | Антипаттерн |
| Header menus → ivi.ru, WatchesBlock CTA на ivi | Чужой бренд |
| PromoSlider / TopWeek на ассетах ivi | Не наш контент |
| `react-player` / `react-video-js-player` «потому что было» | Пока хватает native + hls.js |
| Path SEO `/films/genre/:name` 1:1 | Query-фильтры NEW достаточны; path — только если SEO-ADR |
| Overlay search в header как в OLD | `/search` page — ок |
| Копировать структуру `components/Pages/...` | FSD layers |
| **Nested replies / `parentId`** | Закрыто: [ADR-002](../adr/002-flat-film-reviews.md) — только корневые отзывы |
| Весь `old-client` как submodule навсегда | Цель: удалить (technical-debt п.11) |

---

## Уже лучше в NEW — не «догонять» OLD

- Auth: login/register split, `/profile`, `proxy.ts`, memory access  
- Каталоги: `/genres`, `/countries`, `/persons`, `/professions`  
- `/tv` + HLS IPTV (прототип; доработка = микросервис, не порт OLD)  
- Similar films, comment likes, `usePaginatedResource`  
- Плоские отзывы без дерева — канон ([ADR-002](../adr/002-flat-film-reviews.md))  
- `@common/types`, FSD boundaries, SCSS Modules, RSC/ISR  

---

## Рекомендуемый порядок работ

```
1. ADR: admin in client? | OAuth?
2. Заглушки продукта: скрыть или API для favorites + ratings
3. Admin (если да) на правильном auth/RBAC
4. Film UX: share / fullscreen trailer / PlayerPanel — по приоритету дизайна
5. Home promo/Top-N — только со своими данными
6. i18n
7. Vitest smoke
8. Удалить old-client/ из репо
```

---

## Краткий чеклист статуса

- [ ] Admin (или deprecate + ADR)
- [x] Nested comments → **не делаем**, [ADR-002](../adr/002-flat-film-reviews.md)
- [ ] OAuth (или skip)
- [ ] Favorites API / убрать fake UI
- [ ] Ratings API (заменить `submitFilmGrade` stub)
- [ ] Share (opt)
- [ ] Fullscreen trailer (opt)
- [ ] Promo/Top-N свои (opt)
- [ ] i18n
- [ ] Client tests
- [ ] Remove `old-client/`
