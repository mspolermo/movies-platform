#!/bin/sh
set -eu

: "${POSTGRES_HOST:?POSTGRES_HOST is required}"
: "${POSTGRES_PORT:?POSTGRES_PORT is required}"
: "${POSTGRES_USER:?POSTGRES_USER is required}"
: "${POSTGRES_PASSWORD:?POSTGRES_PASSWORD is required}"
: "${POSTGRES_DB:?POSTGRES_DB is required}"

export PGPASSWORD="${POSTGRES_PASSWORD}"

run_psql() {
  psql \
    -v ON_ERROR_STOP=1 \
    -h "${POSTGRES_HOST}" \
    -p "${POSTGRES_PORT}" \
    -U "${POSTGRES_USER}" \
    -d "${POSTGRES_DB}" \
    "$@"
}

is_schema_ready() {
  run_psql -tA -c "
    SELECT COUNT(*) = 11
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name IN (
        'Comment',
        'Country',
        'Fact',
        'Film',
        'Genre',
        'Person',
        'Profession',
        '_CountryToFilm',
        '_FilmToGenre',
        '_FilmToPerson',
        '_PersonToProfession'
      );
  "
}

is_seed_applied() {
  run_psql -tA -c 'SELECT EXISTS (SELECT 1 FROM public."Film" LIMIT 1);'
}

reset_seed_tables() {
  run_psql -c '
    TRUNCATE TABLE
      public."Comment",
      public."Fact",
      public."_CountryToFilm",
      public."_FilmToGenre",
      public."_FilmToPerson",
      public."_PersonToProfession",
      public."Country",
      public."Genre",
      public."Profession",
      public."Person",
      public."Film"
    RESTART IDENTITY CASCADE;
  '
}

attempt=0
max_attempts=180

until [ "$(is_schema_ready)" = "t" ]; do
  attempt=$((attempt + 1))

  if [ "${attempt}" -ge "${max_attempts}" ]; then
    echo "Kino DB schema was not created in time"
    exit 1
  fi

  echo "Waiting for Sequelize schema in Postgres..."
  sleep 2
done

if [ "$(is_seed_applied)" = "t" ]; then
  echo "Kino DB seed already exists, skipping"
  exit 0
fi

echo "Applying Kino DB development seed..."
reset_seed_tables
run_psql -f /seed/10-seed-dictionaries.sql
run_psql -f /seed/20-seed-content.sql
run_psql -f /seed/30-seed-relations.sql
run_psql -f /seed/40-sequence-values.sql
echo "Kino DB development seed applied"
