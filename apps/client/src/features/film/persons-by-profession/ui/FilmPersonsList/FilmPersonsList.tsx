'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { InfiniteScroll } from '@/shared/ui';
import { Card } from '@/shared/ui';
import { useFilmPersonsByProfession } from '@/features/film/persons-by-profession';
import styles from './FilmPersonsList.module.scss';

interface FilmPersonsListProps {
  filmId: number;
  professionName: string | null;
}

export const FilmPersonsList: React.FC<FilmPersonsListProps> = ({
  filmId,
  professionName,
}) => {
  const router = useRouter();
  const { persons, loading, error, hasMore, loadMore } = useFilmPersonsByProfession({
    filmId,
    professionName,
    initialPage: 1,
    initialLimit: 14,
  });

  const handlePersonClick = (personId: number) => {
    router.push(`/persons/${personId}`);
  };

  if (!professionName) {
    return null;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (persons.length === 0 && !loading) {
    return (
      <div className={styles.emptyState}>
        Нет персон в этой профессии
      </div>
    );
  }

  return (
    <InfiniteScroll
      onLoadMore={loadMore}
      isLoading={loading}
      hasMore={hasMore}
      className={styles.infiniteScroll}
    >
      <div className={styles.personsList}>
        {persons.map((person) => (
          <Card
            key={person.id}
            type="small"
            title={person.nameRu || person.nameEn}
            photoUrl={person.photoUrl}
            onClick={() => handlePersonClick(person.id)}
          />
        ))}
      </div>
    </InfiniteScroll>
  );
};

