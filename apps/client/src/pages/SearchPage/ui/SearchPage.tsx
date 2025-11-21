'use client';

import React, { useEffect, useState } from 'react';
import { Layout } from '@/widgets/Layout';
import { Input } from '@/shared/ui/Input';
import { FilmCard } from '@/entities/film';
import { PersonCard } from '@/entities/person';
import apiClient from '@/shared/api/client';
import { API_ENDPOINTS } from '@/shared/api/endpoints';
import { TFilmBased, TPersonBased } from '@common/types';
import styles from './SearchPage.module.scss';

interface SearchResult {
  films: TFilmBased[];
  persons: TPersonBased[];
}

export const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult>({
    films: [],
    persons: [],
  });

  useEffect(() => {
    if (!query.trim()) {
      setResults({ films: [], persons: [] });
      return;
    }

    const timeoutId = setTimeout(() => {
      fetchResults(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const fetchResults = async (currentQuery: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('name', currentQuery);
      const { data } = await apiClient.get(
        `${API_ENDPOINTS.SEARCH.GLOBAL}?${params.toString()}`
      );

      const films = Array.isArray(data?.films) ? data.films : [];
      const persons = Array.isArray(data?.persons) ? data.persons : [];

      setResults({
        films,
        persons,
      });
    } catch (error) {
      console.error('Error fetching search results:', error);
      setResults({ films: [], persons: [] });
    } finally {
      setLoading(false);
    }
  };

  const hasResults =
    results.films.length > 0 || results.persons.length > 0;

  return (
    <Layout>
      <div className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>Поиск</h1>
          <Input
            placeholder="Введите название фильма или персоны..."
            className={styles.input}
            value={query}
            autoFocus
            onChange={(e) => setQuery(e.target.value)}
          />

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
                  <div className={styles.filmsList}>
                    {results.films.map((film) => (
                      <FilmCard
                        key={`film-${film.id}`}
                        film={film}
                        showIcons
                      />
                    ))}
                  </div>
                </section>
              )}

              {results.persons.length > 0 && (
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>Персоны</h2>
                  <div className={styles.personsList}>
                    {results.persons.map((person) => (
                      <PersonCard key={`person-${person.id}`} person={person} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
