# 004. Действия фильма: `openFilmActions` (rate + share + panel)

- **Статус:** Accepted
- **Дата:** 2026-07-25
- **Участники:** —

## Контекст

Нужны F6 (share: Web Share + copy link) и F8 (панель действий на карточке и деталке: rate, share, favorite stub). Раньше оценка жила в отдельной feature `rateFilm` + `FilmGradeActionContext` / `RateFilmProvider`. Плодить второй Provider/context для share и третий слайс для панели — лишняя связность: UI-кнопки всё равно вызывают те же модалки.

Entity не может импортить feature (FSD). Home — RSC: нельзя прокидывать `renderActions` с сервера в client-карусель. Features не импортит features.

OLD: SharePanel — chrome без handlers; соцкнопки (WA/TG/VK/…) — stubs; PlayerPanel имел Trailer CTA + bookmark + share. Dislike / «Похожие» на карточке в новом клиенте **не** переносим.

## Решение

### Архитектура / FSD

| Инвариант | Деталь |
|-----------|--------|
| Слайс | Одна feature `openFilmActions` (verbNoun); `rateFilm` **поглощён** |
| Provider | `FilmActionsProvider` в той же feature, mount в `Layout` |
| Context (open) | Entity `FilmActionsContext`: `{ openGradeFilm, openShareFilm }` |
| Context (card UI) | Entity `FilmCardActionsContext`: renderer `(film) => ReactNode`; Provider отдаёт `<FilmActionsPanel variant="card" />` — списки/карусели/`search` не импортят feature |
| Detail | Слот `actionsPanel` на `FilmDetail`; `FilmDetailPage` инжектит `<FilmActionsPanel variant="detail" />` |
| Panel | `variant: 'card' \| 'detail'`; film — discriminated union (`TFilmListItemResponse` / `TFilmDetailsResponse`) |
| Структура слайса | `ui/<Component>/` + barrels; `lib/utils/` + barrels (см. `context/frontend.md`) |
| Цвета | Только токены из `apps/client/src/app/styles/colors.scss` (без хардкода hex в слайсе) |

### Состав действий

| Action | Card | Detail | Поведение |
|--------|------|--------|-----------|
| Избранное | да | да | Local toggle + `console.log`; визуальный active. API — после F3 / отдельного ADR |
| Оценить | да | да | `openGradeFilm(id)` → modal 1–10; без auth → `/auth/login` |
| Поделиться | да | да | `openShareFilm(payload)` → modal: copy + Web Share |
| Трейлер CTA | нет | нет | Embed на странице остаётся; кнопки в панели нет |
| Похожие / Не нравится | нет | нет | Удалены из UI |

### UX / иконки / UI

| Инвариант | Деталь |
|-----------|--------|
| Иконка «Оценить» | `RateIcon` = outline **thumbs-up** ([Lucide](https://lucide.dev/icons/thumbs-up)); **не** звезда (звезда путается с избранным и KP) |
| Иконка избранного | Bookmark / BookmarkFilled |
| Иконка шаринга | Share (upload-style) |
| Card overlay | hover-as-is; `showIcons` + actions из `FilmCardActionsContext`; `stopPropagation` на кнопках |
| Detail panel | Полоса из 3 равных кнопок (иконка + подпись): Избранное / Оценить / Поделиться; фон `--color-background-elements`, бордер `--color-split-line` |
| Rating KP-блок | Только ссылка на Кинопоиск в новом окне; **без** кнопки «Оценить» |
| Share modal | Meta (постер, title, year · duration); ряды copy / native share на `--color-icon-default` / hover `--color-icon-default-hover`; URL в подписи copy; feedback «Скопировано»; без соц-intent stubs |
| Share URL | `` `${origin}/films/${id}` `` |
| Native share | `navigator.share` если есть; `AbortError` глотать; fail → UX feedback |
| Copy | `clipboard.writeText` + fallback `execCommand`; fail → UX feedback |
| Auth gate | Пока `useAuth().isLoading` — очередь `pendingGradeFilmId` в `useFilmActionsModals`; без auth → `buildLoginHref()` (`entities/user`) → `/auth/login?returnUrl=…` |

Запрещено без нового ADR:

- Отдельные слайсы `shareFilm` / `rateFilm`
- Соц-intent матрица (WA/VK/TG/…)
- Favorites API внутри этой фичи
- Trailer CTA / scroll-to-trailer / BigPlayer fullscreen «как в OLD»
- Возврат кнопки «Не нравится» / «Похожие» в overlay без отдельной задачи
- Иконка оценки = звезда (конфликт семантики с bookmark / KP)

Клиент: `apps/client/src/features/openFilmActions`.  
Entity extension: `entities/film/model/` — `types.ts` + `context/` (`FilmActionsContext`, `FilmCardActionsContext`).  
Иконка: `shared/ui/SvgIcon/assets/rate.svg` (через `<SvgIcon icon="rate" />`).

## Последствия

**Плюсы**

- Один Layout-provider вместо цепочки grade/share.
- Карточки с `showIcons` получают actions автоматически при наличии Provider (RSC Home / features→features не ломаются).
- Чёткое разделение: bookmark = сохранить, thumbs-up = оценить, share = ссылка.

**Минусы / риски**

- Stub favorite/grade не являются контрактом бэка; состояние favorite сбрасывается при remount.
- Touch: overlay карточки по-прежнему только hover.
- Native share недоступен на большинстве desktop — остаётся copy.

## Альтернативы

1. **Две фичи + один context** (`rateFilm` + `shareFilm`) — лишний boundary при общей панели.
2. **Widgets `*WithActions`** на каждый список — нужно при render-prop инъекции; с `FilmCardActionsContext` не требуются.
3. **UI кнопок в entity** + только open-хендлеры из context — entity раздувается продуктовыми действиями.
4. **Звезда для «Оценить»** — отклонено: коллизия с избранным и KP-рейтингом.
5. **Trailer CTA в detail-панели** — отклонено: трейлер уже на странице embed’ом.
