# Frontend Rules

Область: `apps/client`.  
См. [naming.md](./naming.md), [api.md](./api.md).

## FSD

| Слой | Можно импортировать |
|------|---------------------|
| `app/` (routes) | pages, shared |
| `pages` | widgets, features, entities, shared |
| `widgets` | features, entities, shared |
| `features` | entities, shared |
| `entities` | shared, (осторожно другие entities) |
| `shared` | только shared |

- Нарушения ловит `eslint-plugin-boundaries` / `@feature-sliced`.
- Публичный API слайса — через `index.ts`.
- Роуты Next (`app/**/page.tsx`) — тонкие; UI-логика в `src/pages`.

## React / Next

- App Router: Server Components по умолчанию; `'use client'` только при hooks/событиях/браузерном API.
- Server Actions (`'use server'`) — для серверных fetch справочников/prefetch где уже принято.
- Early return; обработчики событий — `handle*`.
- Не тащить клиентский бандл ради данных, которые можно получить на сервере.

## Данные и state

- **Нет React Query** — не добавлять без ADR.
- HTTP: `shared/api` (axios), endpoints централизованно.
- Access token — module-scope memory (`shared/api/lib`), **не** localStorage / не zustand.
- Zustand — один store `useUserStore` (`entities/user`); не складывать туда токены.
- Пагинация/infinite — `usePaginatedResource` + feature-hooks (`useLoadMoreFilms`, `useFilmComments`, …).
- UX-редиректы сессии: `apps/client/proxy.ts` (не `middleware.ts`).
- Server Actions сейчас: только `getCountriesList`, `getGenresList`, `getFilmsFilters`.

## Типы

- Только `import type { … } from '@common/types'`.
- Запрещено: `@common/dto`, `@common/types/orm`, `@common/types/entity`.

## UI

- Стили: SCSS Modules рядом с компонентом.
- UI-kit: `shared/ui`; не плодить дубли Button/Input.
- A11y: keyboard + aria на интерактивных элементах.

## Отзывы к фильму

- Только **корневые** отзывы (`title` + `text`); без reply/`parentId`/дерева. См. [ADR-002](../adr/002-flat-film-reviews.md).
- Лайки отзывов — ок; UI тредов не добавлять без нового ADR.

## Auth UX

- `has_session` — только хинт для proxy/UI, не security.
- После failed refresh — очистить access + UX-cookie, редирект на login.
