# Старый Дамп `final-kino-initial-data-dump.sql`

## Статус

Это старый архивный dump.

Актуальный dev flow для `kino-db` больше не поднимается из этого файла и переехал на seed-набор в `devops/kino-db/seed`.

Текущий dump сохранен в `devops/kino-db/old-dump` как historical snapshot и reference.

## Назначение

`final-kino-initial-data-dump.sql` — это полный дамп PostgreSQL, созданный через `pg_dump`.
Файл не просто содержит данные: он заново собирает схему БД, загружает начальные записи и восстанавливает ограничения/индексы.

Источник дампа:

- PostgreSQL `15.2`
- `pg_dump 15.2`
- дата создания: `2023-05-27 12:21:19 UTC`

## Что делает файл по порядку

1. Выставляет служебные параметры сессии PostgreSQL:
   `statement_timeout`, `lock_timeout`, `client_encoding`, `row_security` и другие.
2. Настраивает схему `public` и владельца объектов.
3. Создает таблицы доменной модели и служебную таблицу миграций.
4. Создает sequence для автоинкрементных `id`.
5. Привязывает sequence к `id`-колонкам через `ALTER TABLE ... SET DEFAULT nextval(...)`.
6. Загружает данные в таблицы через `COPY ... FROM stdin`.
7. Выставляет текущие значения sequence через `SELECT pg_catalog.setval(...)`.
8. Добавляет `PRIMARY KEY`.
9. Создает `UNIQUE INDEX` и обычные индексы.
10. Добавляет `FOREIGN KEY` связи с `ON UPDATE CASCADE ON DELETE CASCADE`.
11. В конце выполняет `REVOKE USAGE ON SCHEMA public FROM PUBLIC`.

## Какие таблицы создаются

Основные таблицы:

- `Comment` — комментарии к фильмам
- `Country` — страны
- `Fact` — факты о фильмах
- `Film` — фильмы
- `Genre` — жанры
- `Person` — персоны
- `Profession` — профессии

Таблицы связей many-to-many:

- `_CountryToFilm`
- `_FilmToGenre`
- `_FilmToPerson`
- `_PersonToProfession`

Служебная таблица:

- `_prisma_migrations` — история Prisma-миграций

## Какие данные загружаются

По `setval(...)` в конце файла можно понять минимальный порядок объема данных в дампе:

- `Comment`: `10`
- `Country`: `65`
- `Fact`: `10689`
- `Film`: `994`
- `Genre`: `24`
- `Person`: `61128`
- `Profession`: `9`

Это не аналитический отчет по строкам, а практический ориентир: sequence выставлены так, чтобы следующие `INSERT` продолжали нумерацию после импортированных данных.

## Какие связи восстанавливаются

Файл явно добавляет внешние ключи:

- `Comment.filmId -> Film.id`
- `Fact.filmId -> Film.id`
- `_CountryToFilm.A -> Country.id`
- `_CountryToFilm.B -> Film.id`
- `_FilmToGenre.A -> Film.id`
- `_FilmToGenre.B -> Genre.id`
- `_FilmToPerson.A -> Film.id`
- `_FilmToPerson.B -> Person.id`
- `_PersonToProfession.A -> Person.id`
- `_PersonToProfession.B -> Profession.id`

Во всех этих связях используется каскадное обновление и удаление:

- `ON UPDATE CASCADE`
- `ON DELETE CASCADE`

## Какие ограничения и индексы есть

Первичные ключи:

- `Comment_pkey`
- `Country_pkey`
- `Fact_pkey`
- `Film_pkey`
- `Genre_pkey`
- `Person_pkey`
- `Profession_pkey`
- `_prisma_migrations_pkey`

Уникальные индексы:

- `Country_countryName_key`
- `Genre_nameRu_key`
- `Profession_name_key`
- `*_AB_unique` для таблиц связей

Дополнительные индексы:

- `*_B_index` для таблиц связей

## Практический смысл

Этот файл нужен для быстрого поднятия стартовой базы Kino-проекта с уже заполненными фильмами, персонами, жанрами, странами, фактами и связями между ними.

Если выполнить файл на пустой PostgreSQL-базе, он:

- создаст структуру таблиц
- загрузит данные
- восстановит автоинкременты
- включит ограничения целостности
- создаст индексы для нормальной работы запросов

## Важные замечания

- Файл рассчитан на PostgreSQL, а не на универсальный SQL-движок.
- Это именно dump базы, а не hand-written migration.
- Порядок секций важен: сначала структура и данные, потом ограничения и индексы.
- Из-за `ON DELETE CASCADE` удаление родительских сущностей будет тянуть зависимые записи.
- Наличие `_prisma_migrations` показывает, что схема связана с Prisma.
