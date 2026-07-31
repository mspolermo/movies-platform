# 008. User–film prefs (favorites + ratings) в auth-users

- **Статус:** Accepted
- **Дата:** 2026-07-31
- **Участники:** —

## Контекст

Нужны F3/F4: избранное и оценка фильма пользователем (1–10). UI stubs в `openFilmActions`. Comments/likes уже в kino-db (film-centric). Prefs читаются как «моё» (панель, будущий профиль) — user-centric.

## Решение

### Владение данными

- Таблицы `user_favorites`, `user_film_ratings` — в **auth-users** (FK → User, `ON DELETE CASCADE`).
- `filmId` — логический integer **без** FK на kino (разные БД).
- На write (`POST` favorite / `PUT` rating) gateway проверяет фильм через kino-db `getFilmById`.
  - `PUT` rating при отсутствии фильма → orphan cleanup (`ratings.delete`) + **404** (контракт «оценить нельзя»).
  - `POST` favorite: фильм есть → `favorites.toggle`; фильма нет (404) → `favorites.remove` (idempotent orphan cleanup, без create).
  - `DELETE` rating — без проверки фильма (idempotent).
- Path `filmId` на gateway — `ParsePositiveIntPipe` (>= 1) до kino-hop.
- `favorites.toggle` / `favorites.remove` и `ratings.upsert` / `ratings.delete` сериализуются одним `pg_advisory_xact_lock(userId, filmId)`.
- Клиент: после fail hydrate избранного retry + toggle только если filmId ещё не в Set (UI при `!isReady` всегда «add»); `PUT` rating 404 → `clearGrade` в Map.

### Два read-контракта

| Контракт | Назначение |
|----------|------------|
| Paginated list (`TPaginatedItemsResponse`) | Профиль / LoadMore later; ORDER BY `createdAt`/`updatedAt` DESC, `id` DESC |
| Compact (`GET /favorites/ids`, `GET /ratings/grades`) | Hydrate панели за 1 RPC каждый |

### Клиент / FSD

- HTTP в `entities/film/api`; избранное — feature `toggleFilmFavorite` + entity-context.
- Оценка — в `openFilmActions` (замена stub); Favorites API **не** внутри этой feature (ADR-004).
- Порог UI «плохо/хорошо»: 1–6 / 7–10; константы grade на BE (`FILM_USER_GRADE_*`); на FE — литерал + JSDoc sync (без value-import `@common/constants`).

### Comments

Comments и CommentLike **остаются** в kino-db (film-centric контент, FK на Film/Comment).

## Последствия

**Плюсы:** prefs рядом с аккаунтом; профиль = list auth-users → enrich film cards на gateway later.

**Минусы / риски:** orphans при delete Film до следующего write пользователя (favorite toggle / rating upsert на тот же filmId чистят); compact JSON растёт с числом prefs; write = 2 RMQ hop.

## Альтернативы

1. **Prefs в kino-db** (рядом с comments) — проще JOIN на фильм; смешивает каталог и аккаунт. Отклонено: явный выбор auth-users.
2. **Только paginated list + page-drain на FE** — N round-trips до hydrate панели. Отклонено в пользу compact ids/grades.
3. **Перенос comments в auth-users** — ломает film-centric query path. Отклонено.
