'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { SvgIcon } from '@/shared/ui/SvgIcon';
import { Input } from '@/shared/ui/Input';
import { Overlay } from '@/shared/ui';
import { SearchResultItem } from './SearchResultItem/SearchResultItem';
import { TFilmBased, TPersonBased } from '@common/types';
import apiClient from '@/shared/api/client';
import { API_ENDPOINTS } from '@/shared/api/endpoints';
import styles from './FimsSearch.module.scss';
import { FilmsSearchProps } from './types';

interface SearchResult {
  films: TFilmBased[];
  persons: TPersonBased[];
}

export const FimsSearch = (props: FilmsSearchProps) => {
  const { isOpen, handleClose } = props;
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult>({
    films: [],
    persons: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setSearchResults({ films: [], persons: [] });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ films: [], persons: [] });
      return;
    }

    const timeoutId = setTimeout(() => {
      fetchSearchResults();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const fetchSearchResults = async () => {
    try {
      setLoading(true);
      // Используем URLSearchParams для правильной кодировки кириллицы
      const params = new URLSearchParams();
      params.append('name', searchQuery);
      const url = `${API_ENDPOINTS.SEARCH.GLOBAL}?${params.toString()}`;
      const response = await apiClient.get(url);

      const films = response.data?.films || [];
      const persons = response.data?.persons || [];

      // Берем первые 4 фильма и первые 4 персоны
      const limitedFilms = films.slice(0, 4);
      const limitedPersons = persons.slice(0, 4);

      setSearchResults({
        films: limitedFilms,
        persons: limitedPersons,
      });
    } catch (err) {
      console.error('Error fetching search results:', err);
      setSearchResults({ films: [], persons: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = useCallback(() => {
    handleClose();
    setSearchQuery('');
    setSearchResults({ films: [], persons: [] });
  }, [handleClose]);

  const hasResults = searchResults.films.length > 0 || searchResults.persons.length > 0;

  return (
    <Overlay isOpen={isOpen} onClose={handleClose}>
      <div className={styles.searchBlock}>
        <button className={styles.close} onClick={handleClose}>
          <SvgIcon name="close" size={30} />
        </button>
        <div className={styles.modal}>
          <h2 className={styles.heading}>Поиск</h2>
          <Input
            placeholder="Поиск фильмов, сериалов, мультфильмов..."
            className={styles.input}
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {loading && (
            <div className={styles.loading}>Поиск...</div>
          )}
          {!loading && hasResults && (
            <div className={styles.results}>
              {searchResults.films.map((film) => (
                <SearchResultItem
                  key={`film-${film.id}`}
                  id={film.id}
                  title={film.filmNameRu || film.filmNameEn || ''}
                  subtitle={film.filmNameEn || film.filmNameRu || ''}
                  iconName="tv"
                  type="films"
                  onClick={handleResultClick}
                />
              ))}
              {searchResults.persons.map((person) => (
                <SearchResultItem
                  key={`person-${person.id}`}
                  id={person.id}
                  title={person.nameRu || person.nameEn || ''}
                  subtitle={person.nameEn || person.nameRu || ''}
                  iconName="person"
                  type="persons"
                  onClick={handleResultClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Overlay>
  );
};
