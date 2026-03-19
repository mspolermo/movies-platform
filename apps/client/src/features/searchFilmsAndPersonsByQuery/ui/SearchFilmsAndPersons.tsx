import { PersonCard } from "@/entities/person"
import { useSearchByQuery } from "../lib"
import { Input } from "@/shared/ui"
import styles from './SearchFilmsAndPersons.module.scss';
import { useState } from "react";
import { FilmCard } from "@/entities/film";

//TODO: убрать контейнер

export const SearchFilmsAndPersons = () => {
  const [query, setQuery] = useState('');
  
  const { loading, results } = useSearchByQuery(query)

  const hasResults =
  results.films.length > 0 || results.persons.length > 0;

  return (
    <div className={styles.container}>
      <div className={styles.inputWrapper}>
        <Input
          placeholder="Введите название фильма или персоны..."
          value={query}
          autoFocus
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>


      {loading && (
        <div className={styles.state}>Поиск...</div>
      )}

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
                    <FilmCard film={film} showIcons />
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
  )
}