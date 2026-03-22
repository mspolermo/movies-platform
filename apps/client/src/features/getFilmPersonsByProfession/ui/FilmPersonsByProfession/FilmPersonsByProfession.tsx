'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { LoadMoreSection } from '@/shared/ui';
import { Card } from '@/shared/ui';

import styles from './FilmPersonsByProfession.module.scss';
import { useFilmPersonsByProfession } from '../../lib';

interface TFilmPersonsByProfessionProps {
  filmId: number;
  professionName: string | null;
}

export const FilmPersonsByProfession = ({
  filmId,
  professionName,
}: TFilmPersonsByProfessionProps) => {
  const router = useRouter();
  const { persons, loading, error, hasMore, loadMore } =
    useFilmPersonsByProfession({
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
    return <div className={styles.emptyState}>Нет персон в этой профессии</div>;
  }

  return (
    <LoadMoreSection
      className={styles.infiniteScroll}
      hasMore={hasMore}
      isLoading={loading}
      onLoadMore={loadMore}
    >
      <div className={styles.personsList}>
        {persons.map((person) => (
          <Card
            key={person.id}
            photoUrl={person.photoUrl}
            title={person.nameRu || person.nameEn}
            type="small"
            onClick={() => handlePersonClick(person.id)}
          />
        ))}
      </div>
    </LoadMoreSection>
  );
};
