'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LoadMoreSection } from '@/shared/ui';
import { Card } from '@/shared/ui';
import { useFilmPersonsByProfession } from '../../lib';
import styles from './FilmPersonsByProfession.module.scss';

interface TFilmPersonsByProfessionProps {
  filmId: number;
  professionName: string | null;
}

export const FilmPersonsByProfession = ({
  filmId,
  professionName,
}: TFilmPersonsByProfessionProps) => {
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
    <LoadMoreSection
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
    </LoadMoreSection>
  );
};

