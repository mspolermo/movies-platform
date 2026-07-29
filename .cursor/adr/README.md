# ADR — Architecture Decision Records

Каталог: `.cursor/adr/`.

## Зачем

Фиксировать **почему** выбрали подход. Cursor и команда читают ADR без разбора git-истории.

## Когда писать

- Смена auth / транспорта / границ сервисов / БД
- Новая кросс-срезовая зависимость (React Query, Redis, …)
- Версионирование API, миграции вместо `synchronize`

Не писать на мелкие рефакторинги модуля.

## Формат

Имя: `NNN-short-title.md`

```markdown
# NNN. Заголовок

- **Статус:** Proposed | Accepted | Deprecated | Superseded by ADR-XXX
- **Дата:** YYYY-MM-DD

## Контекст
## Решение
## Последствия
## Альтернативы
```

После Accept — обновить `PROJECT_CONTEXT.md`, `.cursor/*`, `.cursor/context/*` при необходимости.

## Реестр

| ADR | Заголовок | Статус |
|-----|-----------|--------|
| [001](./001-jwt-access-opaque-refresh.md) | JWT access + opaque refresh (HttpOnly cookie) | Accepted |
| [002](./002-flat-film-reviews.md) | Плоские отзывы к фильму (без дерева) | Accepted |
| [003](./003-home-promo-banner-slider.md) | Рекламный слайдер на Home (статика, без перехода) | Accepted |
| [004](./004-open-film-actions.md) | Действия фильма: `openFilmActions` (rate + share + panel) | Accepted |
| [005](./005-admin-in-b2c.md) | Admin в B2C (`/admin/*`): FE stubs + контракт BE | Accepted |
| [006](./006-no-oauth.md) | Без OAuth (email/password JWT) | Accepted |
| [007](./007-admin-be-implementation.md) | Реализация Admin BE (F1 BE + B5): пагинация, RPC-ошибки, delete-стратегия, RBAC | Accepted |
