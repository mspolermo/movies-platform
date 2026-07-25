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
