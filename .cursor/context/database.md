# Database Rules

Область: Sequelize models в `kino-db`, `auth-users`; SQL в `devops/`.  
Стиль SQL: `.cursor/rules/code-format-sql.mdc`.

## Общие

- Две БД: **kino** (`db`) и **users** (`db2`) — не смешивать схемы между сервисами.
- Сервис ходит только в свою БД.
- Наружу из MS — не модели, а `T*Response` после mapper.

## Sequelize

- Модели в `*/models/*.model.ts`, декораторы `sequelize-typescript`.
- Ассоциации объявлять явно (`@BelongsToMany`, `@HasMany`, `@BelongsTo`).
- Join-таблицы N:M: `_FilmToGenre`, `_CountryToFilm`, `_FilmToPerson`, `_PersonToProfession`, `user_roles`.
- Именование: kino — **PascalCase** singular (Prisma-legacy); users — **snake_case** plural.
- Join-колонки часто сырые `A`/`B` в БД; Sequelize мапит через `field` (`filmId`←`A`, …). `_PersonToProfession` — ещё сырые `A`/`B` в модели (+ TODO).
- `timestamps: false` на контентных таблицах kino; ручные `createdAt` у Film/Comment/CommentLike. Auth — Sequelize timestamps (кроме `user_roles`).
- Сейчас `synchronize: true` — **не полагаться** на это в prod; новые изменения схемы фиксировать в seed/SQL и документации.
- FK users↔comments **нет** (разные БД) — целостность на уровне приложения.
- FK users↔Film **нет**: `user_favorites` / `user_film_ratings` хранят логический `filmId`; проверка существования фильма — на gateway (ADR-008). Unique `(userId, filmId)`; list-индексы `(userId, createdAt/updatedAt, id)`.
- Новые seed-шаги — append в `devops/kino-db/seed/` (не править applied SQL «на месте» без необходимости).

## Индексы и запросы

- Для частых фильтров/FK — индексы (осознанно; ILIKE `%…%` без триграммов — bottleneck).
- Unique: email пользователя, value роли, пары в join где нужно.
- Избегать N+1: `include` / заранее продуманные queries.
- Пагинация: limit/offset (или существующие константы `LIST_*` из `@common/constants`).

## Nullable / типы

- Nullable в модели = optional в `T*Entity` / корректный `| null` в response.
- Даты в API-response — ISO **string**; в Entity/ORM допустим `Date`.
- Не хранить пароли/refresh в plain text: bcrypt / SHA-256 hash.

## ER (кратко)

**kino:** Film 1—M Fact, Comment; Film N—M Genre/Country/Person; Person N—M Profession; Comment 1—M CommentLike; Comment self-parent.

**users:** User N—M Role; User 1—M RefreshToken; User 1—M user_favorites / user_film_ratings (`filmId` без FK на kino).

Подробнее: [`../project-index.md`](../project-index.md). Долг схемы: [`../temp/backlog.md`](../temp/backlog.md) (B1).
