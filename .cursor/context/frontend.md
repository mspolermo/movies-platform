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

## Структура UI в слайсе

- В `ui/` каждый компонент/виджет слайса — **своя подпапка** + `index.ts` (barrel).
- Рядом: `Component.tsx`, `Component.module.scss`, `types.ts` (props и публичные типы UX).
- Сегмент `ui/index.ts` реэкспортирует только публичное.
- Запрещено: сваливать несколько несвязанных `*.tsx` плоско в `ui/` (исключение — совсем крошечный слайс с **одним** компонентом, как сейчас `navigateBack`).
- То же для `widgets/` и составных `entities/*/ui`, где больше одного компонента.

### Типы UX-компонента

- Props и связанные публичные типы компонента — в `ui/<Component>/types.ts` рядом с `.tsx`.
- В `.tsx` только `import type { T…Props } from './types'`.
- Локальные union’ы шага/стейта UI (`'idle' | 'copied'`, `'rate' | 'success'`) можно оставить в `.tsx`, если наружу не отдаются.
- Запрещено: объявлять `T*Props` внутри `Component.tsx`.

## Структура `lib` в слайсе

- Утилиты/хелперы — в `lib/utils/` (+ `lib/utils/index.ts`).
- Хуки — в `lib/hooks/` (+ barrel), не файлами в корне `lib/`.
- `lib/index.ts` — публичный реэкспорт сегмента.
- Запрещено: сваливать `*.ts` утилиты плоско в корень `lib/` (рядом с `hooks/`/`utils/`).

### Утилита в `lib/utils/`

Каждая утилита — **своя папка** с именем функции/модуля (camelCase):

```
lib/utils/
  copyText/
    copyText.ts          # реализация
    copyText.test.ts     # unit-тест (рядом, если есть)
    index.ts             # barrel: export { copyText } from './copyText'
  index.ts               # реэкспорт папок: export { copyText } from './copyText'
```

- Тест: `<name>.test.ts` рядом с `<name>.ts` — **не** общий `*.utils.test.ts` на несколько утилит.
- `lib/utils/index.ts` импортирует через barrel папки (`./copyText`), не через `./copyText/copyText`.
- Запрещено: плоские `foo.ts` + `foo.test.ts` прямо в корне `lib/utils/` (исключение — миграция legacy; новые только в папке).

## Структура `model` в слайсе

- Типы сегмента — в `model/types.ts` (или `model/types/`), с кратким JSDoc.
- React context + хуки — в `model/context/` (+ `index.ts` barrel), не плоско в корне `model/`.
- Стейт / actions / store слайса — в `model/` (не чистые хелперы).
- `model/index.ts` — публичный реэкспорт сегмента.
- Запрещено: смешивать типы и context в одном файле в корне `model/`.
- Запрещено: класть чистые утилиты (`resolve*`, `format*`, `build*`, …) в `model/` — только в `lib/utils/<name>/`.

## Отзывы к фильму

- Только **корневые** отзывы (`title` + `text`); без reply/`parentId`/дерева. См. [ADR-002](../adr/002-flat-film-reviews.md).
- Лайки отзывов — ок; UI тредов не добавлять без нового ADR.

## Auth UX

- `has_session` — только хинт для proxy/UI, не security.
- После failed refresh — очистить access + UX-cookie, редирект на login.
