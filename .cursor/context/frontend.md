# Frontend Rules

Область: `apps/client`.  
См. [naming.md](./naming.md), [api.md](./api.md).

## FSD

| Слой | Можно импортировать |
|------|---------------------|
| Next `app/` (routes) | FSD `src/app`, pages, widgets, features, entities, shared (thin wiring) |
| FSD `src/app` | pages, widgets, features, entities, shared |
| `pages` | widgets, features, entities, shared |
| `widgets` | features, entities, shared |
| `features` | entities, shared |
| `entities` | shared, (осторожно другие entities) |
| `shared` | только shared |

- Нарушения ловит `eslint-plugin-boundaries` / `@feature-sliced`.
- Публичный API слайса — через `index.ts`.
- Роуты Next (`app/**/page.tsx`) — тонкие; UI-логика в `src/pages`.
- FSD `src/app`: `styles/` + `providers/` (composition root). Next `app/` лежит в корне клиента (не `_app`) — осознанный deviation от гайда FSD×Next.

## React / Next

- App Router: Server Components по умолчанию; `'use client'` только при hooks/событиях/браузерном API.
- Server Actions (`'use server'`) — для серверных fetch справочников/prefetch где уже принято.
- Early return; обработчики событий — `handle*`.
- Не тащить клиентский бандл ради данных, которые можно получить на сервере.

## Данные и state

- **Нет React Query** — не добавлять без ADR.
- HTTP: `@/shared/api` (axios + `auth/*` + `endpoints.ts`); path/session primitives — `@/shared/api/session`.
- Access token — module-scope memory (`session/accessToken`), **не** localStorage / не zustand.
- Zustand — один store `useUserStore` (`entities/user`); не складывать туда токены.
- Пагинация/infinite — `usePaginatedResource` + feature-hooks (`useLoadMoreFilms`, `useFilmComments`, …).
- Auth/session layout, proxy, ESLint dual-entry — [ADR-001](../adr/001-jwt-access-opaque-refresh.md).
- Admin B2C `/admin/*` — [ADR-005](../adr/005-admin-in-b2c.md): `pages/AdminRootLayout` gate (soft-404 = `NotFoundPage` UI через `shared/ui/NotFoundView`) + `AdminLayout` shell + `manage*` stubs; `API_ENDPOINTS.ADMIN` forward; stubs **не** вызывают `apiClient`; proxy `/admin/:path*`.
- Server Actions сейчас: только `getCountriesList`, `getGenresList`, `getFilmsFilters`.

## Типы

- Только `import type { … } from '@common/types'`.
- Запрещено: `@common/dto`, `@common/types/orm`, `@common/types/entity`.

## UI

- Стили: SCSS Modules рядом с компонентом.
- UI-kit: `shared/ui`; не плодить дубли Button/Input. Структура слайса — см. **shared/ui kit** ниже (не путать с «Структура UI в слайсе»).
- Иконки: только `<SvgIcon icon="camelCaseKey" />` из `shared/ui`; чистые `.svg` в `SvgIcon/assets`, регистрация в `IconsLibrary`; цвет через CSS-токены (`currentColor`), не пропы.
- A11y: keyboard + aria на интерактивных элементах.

## Configs

Тяжёлая логика тулинга — в `apps/client/configs/`:

| Папка | Назначение |
|-------|------------|
| `next/` | NextConfig (images, rewrites, SVGR) |
| `eslint/` | flat ESLint (FSD + React/Next) |
| `vitest/` | Vitest + setup |
| `storybook/` | Storybook 10 (`main`/`preview`, SVGR); mock `next/image` — `configs/mocks/` |


В корне клиента — только тонкие entry (`next.config.ts`, `eslint.config.mjs`), если инструмент требует файл в root.  
Скрипты: `npm run storybook`, `npm run build-storybook`, `npm test` (явный `--config configs/vitest/...`).  
`npm run type-check` = app `tsc` + `tsconfig.tooling.json` (vitest/storybook/mocks).

## shared/ui kit

Эталон: `apps/client/src/shared/ui/SvgIcon`. Один компонент на слайс.

```
shared/ui/<Name>/
  ui/
    <Name>.tsx
    <Name>.module.scss
    index.ts
  model/
    types.ts          # T*Props
    index.ts
  lib/                # только если нужны hooks/utils
    hooks/ | utils/
    index.ts
  stories/
    <Name>.stories.tsx
  tests/
    <Name>.test.tsx
  index.ts            # только публичное: компонент + нужные T*
```

Правила:

- Корневой `shared/ui/index.ts` — компоненты + только типы, которые реально импортят снаружи (`TBreadcrumbItem`, `TSortFilterProps`, …). Не тащить все `T*Props` в root.
- Slice `index.ts`: компонент + `T*Props` (и связанные типы, нужные снаружи слайса, напр. `TBreadcrumbItem`). Variant/Size — в `model/`, в barrel слайса только если нужны потребителю.
- Props: `T*Props` в `model/types.ts` (не объявлять в `.tsx`). Без legacy aliases (`LoaderProps` и т.п.).
- Не экспортировать `stories/`, `tests/`, внутренний `lib/`, `iconsLibrary`.
- Между kit-слайсами: импорт `@/shared/ui/<Name>`, не deep в `ui/`.
- Жирный UI → вынести хуки в `lib/hooks/<name>/`, утилиты в `lib/utils/<name>/`; в `ui/` остаётся wiring.
- Новый слайс: `npm run cc <Name> shared/ui`.
- Для `features`/`widgets`/`entities` с несколькими компонентами — см. **Структура UI в слайсе** (вложенный `ui/<Component>/`).

## Структура UI в слайсе

- Область: `features` / `widgets` / составные `entities/*/ui` (не UI-kit `shared/ui` — там см. **shared/ui kit**).
- В `ui/` каждый компонент/виджет слайса — **своя подпапка** + `index.ts` (barrel).
- Рядом: `Component.tsx`, `Component.module.scss`, `types.ts` (props и публичные типы UX).
- Сегмент `ui/index.ts` реэкспортирует только публичное.
- Запрещено: сваливать несколько несвязанных `*.tsx` плоско в `ui/` (исключение — совсем крошечный слайс с **одним** компонентом, как сейчас `navigateBack`).
- То же для `widgets/` и составных `entities/*/ui`, где больше одного компонента.

### Типы UX-компонента

- Props и связанные публичные типы компонента — в `ui/<Component>/types.ts` рядом с `.tsx`.
- В `.tsx` только `import type { T…Props } from './types'`.
- Локальные union’ы шага/стейта UI (`'idle' | 'copied'`, `'rate' | 'success'`) можно оставить в `.tsx`, если наружу не отдаются.
- Запрещено: объявлять кастомный `T*Props` внутри `Component.tsx`.
- **Исключение:** если у компонента **только** `children` — не заводить `T*Props` / `types.ts`; использовать `PropsWithChildren` из React:

```tsx
import type { PropsWithChildren } from 'react';

export const AuthProvider = ({ children }: PropsWithChildren) => children;
```

- Как только появляется хотя бы одно своё поле помимо `children` — обычный `T*Props` в `types.ts` (можно `PropsWithChildren<{ … }>`).

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

Кратко: `has_session` — только UX-хинт; identity — `@/entities/user`; сценарии — `@/features/auth`.  
Канон (endpoints, dual-entry `api`/`session`, ESLint allowlist, logout vs `buildLoginHref`, proxy) — [ADR-001](../adr/001-jwt-access-opaque-refresh.md).
