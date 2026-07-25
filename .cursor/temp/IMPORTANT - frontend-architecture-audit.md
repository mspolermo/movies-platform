# Архитектурный аудит: `apps/client`

**Дата:** 2026-07-19  
**Стек:** Next 16.2.10 · React 19.2 · TypeScript ~6 strict · FSD · axios · zustand  
**Объём:** ~475 TS/TSX, ~223 barrel `index.ts`, 71 `'use client'`, 0 тестов

---

## Часть 1. Общий вердикт

### Итоговый уровень: **Strong Middle**

Проект выше типичного Middle: реальный FSD с ESLint boundaries, осознанный auth/session, Next 16 migration, общие типы из `@common/types`, тонкие App Router routes. Ниже Senior: нет тестовой культуры, data-layer без Next cache / query-lib, client-boundary слишком высоко, features нарезаны по API-методам, часть UI — junior-паттерны (`Card`, лишние `useCallback`).

| Критерий | Оценка | Почему |
|----------|--------|--------|
| Архитектура | **7/10** | FSD + thin `app/` — зрело; naming features (`get*`), thin widgets, page-level client — минус |
| Качество кода | **7/10** | Чистый стиль, комментарии по делу; `Card.tsx`, FilmCard TODO/useCallback — пятна |
| Типизация | **8/10** | `strict`, нет `any`, контракты из monorepo; нет runtime validation, слабые TS flags |
| Масштабируемость | **6/10** | Слои помогут расти; duplicated pagination, barrel tax, нет query-cache layer |
| Поддерживаемость | **7/10** | Предсказуемые пути, eslint FSD; 223 barrels + 0 tests бьют по onboarding |
| Производительность | **6/10** | LCP/priority, home ISR; axios вне Data Cache, нет dynamic/virtualization |
| React/Next практики | **7/10** | Async params, proxy, RSC на home/detail routes; pages часто целиком client |
| FSD quality | **8/10** | Boundaries реально enforced; 1 public-API break, `get*` ≠ user scenarios |

---

## Часть 2. Архитектурные проблемы

### 1. Features названы как API-методы, не как use-cases

**Где:** `src/features/getAllPersons`, `getFilmComments`, `getSimilarFilmsCarousel`, `getFilmPersonsByProfession`, …

**Почему:** В FSD feature = сценарий пользователя («оставить отзыв», «фильтровать каталог»). `get*` — слой api/entity.

**Критичность:** Средняя (DX/навигация; при росте — хаос имён).

**Senior:**  
- `filterFilms` — оставить (настоящий feature).  
- `getFilmComments` → `reviewFilm` / `filmReviews`.  
- `getSimilarFilmsCarousel` — не feature, а props-композиция в page/widget.

### 2. Thin widget без композиции

**Где:** `src/widgets/FilmCommentsViewer/ui/FilmCommentsViewer.tsx` — `useParams` + обёртка над feature.

**Почему:** Widget в FSD = композиция features/entities. Здесь — passthrough + чтение params (логика должна быть в page или feature).

**Критичность:** Низкая–средняя.

**Senior:** `filmId` с RSC page → props в `FilmCommentsSection`. Widget убрать или расширить реальной композицией.

### 3. Public API bypass

**Где:** `src/pages/ProfessionsPage/ui/types.ts` → `@/widgets/AllCreatorsViewer/models`

**Почему:** Нарушает public API slice; ESLint whitelist иногда не ловит type-only deep path.

**Критичность:** Низкая (но прецедент).

**Senior:** Реэкспорт типа из `widgets/AllCreatorsViewer/index.ts`.

### 4. Cross-layer style coupling

**Где:** `PersonDetail` → `@/entities/person/ui/PersonInfo/PersonInfo.module.scss`

**Почему:** Widget зависит от внутренней вёрстки entity; рефактор entity ломает widget.

**Критичность:** Средняя.

**Senior:** Shared token/mixin или props/className API у entity UI.

### 5. Page chrome форсит client boundary

**Где:** `src/widgets/Layout/ui/Page/Page.tsx` — `'use client'` из‑за optional `BackButton`.

**Почему:** Любая page через `Page` тянет client leaf для chrome; `HomePage` (RSC) всё равно гидрирует `Page`.

**Критичность:** Средняя (RSC value).

**Senior:** RSC `Page` shell + client-only `BackButton` island; или server `h1` + условный client back.

### 6. Бизнес-логика / fake state в entity UI

**Где:** `src/entities/film/ui/FilmCard/FilmCard.tsx` — local `isFavorite`/`notLike`, TODO handlers.

**Почему:** Entity рисует доменный UI; избранное — feature. Сейчас UI врёт пользователю.

**Критичность:** Средняя (продукт + слой).

**Senior:** Убрать или вынести в `features/toggleFilmFavorite` с реальным API.

### 7. Дублирование pagination hooks — сделано

**Было:** один паттерн (page, hasMore, append) скопирован в 4–5 feature-хуках.

**Стало:** [`shared/lib/hooks/usePaginatedResource`](../../apps/client/src/shared/lib/hooks/usePaginatedResource.ts) + thin wrappers.  
Описание: [`usePaginatedResource.md`](./usePaginatedResource.md).

### 8. Auth facade blur

**Где:** `features/auth` реэкспортит `useAuth` из `entities/user`.

**Почему:** Ownership размыт (store в entity, provider в feature).

**Критичность:** Низкая.

**Senior:** Оставить как есть *или* model auth целиком в feature; не смешивать без правила.

### Циклы

Классических циклов слоёв **не найдено**. `session-bridge` намеренно рвёт React↔axios — **хорошо**.

---

## Часть 3. Переусложнения

| Что | Зачем, похоже | Оставить? | Упростить |
|-----|---------------|-----------|-----------|
| **223 barrels** на ~475 файлов | FSD public API | Частично | Barrel только на границе slice; убрать `ui/index` → `lib/hooks/index` цепочки |
| **`navigateBack` feature** | FSD «всё — feature» | Нет | `shared/ui/BackButton` или Layout |
| **`openHeaderDropdown` feature** | То же | Нет | Внутрь `widgets/Layout` |
| **`getSimilarFilmsCarousel`** | Изоляция секции | Нет | Inline title в `FilmDetailPage` / entity carousel |
| **`FilmCommentsViewer` widget** | Слой ради слоя | Нет | Props с page |
| **filterFilms ~63 файла** | Mobile/tablet/laptop | Да, но | Схлопнуть Mobile/Laptop дубли где diff = CSS |
| **9× useCallback в FilmCard** | «оптимизация» | Нет | Обычные функции; `formatDuration` уже в entity lib |
| **Card: useState+useEffect для CSS class** | Неясно | Нет | `cn(styles.card, styles[\`card__${type}\`])` sync |
| **classnames + clsx** | История | Один | Один пакет |
| **Axios + custom hooks вместо RQ** | Контроль / простота | Спорно | При 4+ pagination — RQ окупается |

---

## Часть 4. Недоработки

1. **Тесты:** vitest в package.json, `src/test/setup.ts` отсутствует, `*.test.*` = 0.  
2. **Нет runtime validation** ответов API (zod/valibot) — TS только compile-time.  
3. **Нет shared pagination / query layer** — ~~копипаста hooks~~ → `usePaginatedResource` (см. п.7).  
4. **Нет Next Data Cache** для axios SSR (кроме home `unstable_cache`).  
5. **Layout `getQuickFilters`** без cache — каждый request. → ✅ `unstable_cache` + `DEFAULT_REVALIDATE_SECONDS`.  
6. **Favorites/ratings** — UI stubs.  
7. **IPTV** — client fetch к github CDN, TODO backend (`features/getTV`).  
8. **ShortFilmCard** — raw `<img>`, минуя `shouldSkipImageOptimization`.  
9. **Нет nested layouts** (`app/films/layout.tsx` и т.д.).  
10. **Нет `next/dynamic`** для HLS/IPTV/тяжёлых client islands.  
11. **TS flags:** нет `noUncheckedIndexedAccess`, `noUnusedLocals`.  
12. **Error handling** в hooks: парсинг `err.response.data.message` дублируется вручную.

---

## Часть 5. React / Next.js

### Хорошо

- Thin RSC routes: `app/films/[id]/page.tsx` — `Promise.all`, `notFound()`, typed `TPageProps`.
- `HomePage` без `'use client'` + ISR/`unstable_cache`.
- Next 16: async params, `proxy.ts`, migration doc.
- Auth: memory access + HttpOnly refresh + UX `has_session` + single-flight refresh.
- Images: `remotePatterns` + `shouldSkipImageOptimization` для KP hosts; LCP `priorityCount` на home.
- `loading.tsx` на ключевых маршрутах.

### Плохо

- Большинство `src/pages/*` — `'use client'` wrappers (`FilmsPage`, `FilmDetailPage`, …) → сериализация дерева в client boundary.
- `Page` widget client → RSC value размывается.
- Suspense почти нет (кроме header `useSearchParams`); filters без boundary.
- Axios SSR ≠ Next fetch cache/tags/`"use cache"`.

### Устарело / можно улучшить

- Axios-first для всех GET — ок для SPA, слабо для App Router cache.
- Нет Server Actions для login/register.
- Нет PPR / granular streaming islands.
- Inter в root — продукт-ок, не brand-critique.

---

## Часть 6. TypeScript

### Сильные

- `strict: true`, практически нет `any` / `as unknown as`.
- Контракты `@common/types` (`TFilmDetailsResponse`, `TSearchFilmsParams`) — один source of truth с бэком.
- `TPageProps` под Next 16 Promises.
- Явные return types на API functions.
- ESLint: no `export *` в barrels.

### Слабые

- Нет zod на границе сети.
- Дублирующие локальные prop interfaces vs Pick от common.
- `CardProps` / часть UI — локальные, не связанные с доменом (ок), но непоследовательный naming (`FilmCardProps` vs `T*`).
- `allowJs: true`, нет `noUncheckedIndexedAccess`.
- Error typing через ручные type guards вместо shared `getApiErrorMessage`. → частично: есть `getApiErrorMessage`.

**Поддержка рефакторинга:** высокая внутри monorepo types; средняя в UI из‑за barrels и deep style imports.

---

## Часть 7. Производительность

| Проблема | Влияние | Сложность фикса |
|----------|---------|-----------------|
| `getQuickFilters` каждый layout request → ✅ `unstable_cache` | Latency TTFB на всех страницах | Низкая (`unstable_cache`) |
| Axios вне Data Cache | Лишние origin hits, нет tag revalidation | Средняя (fetch migration / wrap cache) |
| Page-level `'use client'` | Больше JS hydration | Средняя (split islands) |
| Нет virtualization длинных списков | Риск при больших perPage | Средняя |
| Нет `next/dynamic` для hls.js / IPTV | Bundle на маршрутах где не нужно | Низкая |
| FilmCard useCallback spam | Почти нулевой выигрыш, шум | Низкая |
| ShortFilmCard raw img | Нет sizes/opt path | Низкая → ✅ `RemotePoster` |
| Coarse `sizes` на Preview | Лишний image weight | Низкая → ✅ `REMOTE_POSTER_SIZES.filmCard` |
| Auth bootstrap flicker | UX, не perf | Ожидаемо |

---

## Часть 8. Tech Lead: первая неделя / месяц

### Нравится

- FSD + eslint boundaries — не театр.
- Auth/session architecture (`client.ts`, `session-bridge`, `proxy` UX-only).
- Monorepo `@common/types`.
- Thin `app/` + параллельный fetch на film page.
- Документация миграции Next 16.

### Тревожит

- 0 tests при заявленном vitest.
- Product stubs (favorites) в production UI.
- Client-heavy pages vs заявленный RSC.
- Рост filterFilms + copy-paste pagination без абстракции.
- Layout uncached API.

### Неделя 1

1. Cache `getQuickFilters`. ✅  
2. Починить vitest setup + 3–5 smoke tests (parse filters, session helpers, FilmCard render).  
3. Public API fix ProfessionsPage types. ✅  
4. Убрать fake favorite state или спрятать icons.  
5. Shared `getApiErrorMessage`. ✅  

### Месяц 1

1. RSC shells для Film/Films/Person: client только filters/comments/interactive.  
2. Схлопнуть micro-features (`navigateBack`, `openHeaderDropdown`, SimilarFilms wrapper).  
3. Один pagination hook или TanStack Query. ✅ (`usePaginatedResource`)  
4. Shared `RemotePoster` (Preview/Poster/ShortFilmCard/Card). ✅  
5. Dynamic import HLS/IPTV.  
6. Nested layouts + metadata per segment.

### Оставить

- FSD layers + eslint public API.  
- Axios auth/interceptor + session-bridge.  
- `app/` как route adapters.  
- `@common/types` как контракт.  
- URL-driven filters (`parseSettingsFromNextSearchParams`).  
- Home ISR + `unstable_cache` pattern (расширить).

---

## Часть 9. Итог

| Вопрос | Ответ |
|--------|-------|
| Уровень проекта | **Strong Middle** |
| vs Middle | Выше среднего Middle: структура, auth, types, Next 16 |
| vs Senior | Не дотягивает: tests, data/cache architecture, RSC discipline, product completeness |
| Опыт автора | FSD enforcement, session design, monorepo types, migration hygiene |
| Нехватка опыта | Feature slicing by CRUD, premature callbacks, Card effects, zero tests, thin layers |
| Найм Middle | **Да** |
| Найм Strong Middle | **Да** |
| Найм Senior | **Нет** (пока) — Senior = production maturity + умение упрощать слои, не только раскладывать |

Автор явно учился на хороших источниках (FSD, App Router). Следующий уровень — **меньше слоёв ради слоёв, больше системности data/test/RSC**, и не оставлять product stubs в entity UI.
