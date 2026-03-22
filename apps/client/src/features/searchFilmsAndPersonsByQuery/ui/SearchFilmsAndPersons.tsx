import { useState } from 'react';

import { FilmCard } from '@/entities/film';
import { PersonCard } from '@/entities/person';
import { Input } from '@/shared/ui';

import { useSearchByQuery } from '../lib';
import styles from './SearchFilmsAndPersons.module.scss';

//TODO: убрать контейнер

export const SearchFilmsAndPersons = () => {
  const [query, setQuery] = useState('');

  const { loading, results } = useSearchByQuery(query);

  const hasResults = results.films.length > 0 || results.persons.length > 0;

  return (
    <div className={styles.container}>
      <div className={styles.inputWrapper}>
        <Input
          autoFocus
          placeholder="Введите название фильма или персоны..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {loading && <div className={styles.state}>Поиск...</div>}

      {!loading && !hasResults && query.trim().length > 0 && (
        <div className={styles.state}>
          Мы ничего не нашли по вашему запросу.
        </div>
      )}

      {!loading && hasResults && (
        <div className={styles.results}>
          {results.films.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Фильмы</h2>
              <div className={styles.filmsGrid}>
                {results.films.map((film) => (
                  <div key={`film-${film.id}`} className={styles.filmCard}>
                    <FilmCard showIcons film={film} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {results.persons.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Персоны</h2>
              <div className={styles.personsGrid}>
                {results.persons.map((person) => (
                  <div
                    key={`person-${person.id}`}
                    className={styles.personCard}
                  >
                    <PersonCard person={person} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};
