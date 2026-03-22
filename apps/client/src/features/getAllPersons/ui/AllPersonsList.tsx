'use client';

import { PersonCard } from '@/entities/person';
import { LoadMoreSection, Loader } from '@/shared/ui';

import styles from './AllPersonsList.module.scss';
import { usePersonsInfiniteScroll } from '../lib';

export const AllPersonsList = () => {
  const { persons, loading, error, hasMore, loadMore } =
    usePersonsInfiniteScroll({
      initialPage: 1,
      initialLimit: 20,
    });

  if (loading && persons.length === 0) {
    return (
      <div className={styles.loaderWrapper}>
        <Loader size="small" />
      </div>
    );
  }

  if (error && persons.length === 0) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <LoadMoreSection
      hasMore={hasMore}
      isLoading={loading}
      onLoadMore={loadMore}
    >
      <div className={styles.personsGrid}>
        {persons.map((person) => (
          <PersonCard key={person.id} person={person} />
        ))}
      </div>
    </LoadMoreSection>
  );
};
