'use client';

import type { TPaginatedPersonsResponse } from '@common/types';

import { PersonCard } from '@/entities/person';
import { LoadMoreSection, Skeleton } from '@/shared/ui';

import styles from './AllPersonsList.module.scss';
import { usePersonsInfiniteScroll } from '../lib';

const SKELETON_CARD = { height: 280, width: 220 } as const;

const PersonsSkeletonGrid = ({ count }: { count: number }) => (
  <div className={styles.personsGrid}>
    {[...Array(count)].map((_, i) => (
      <Skeleton key={i} height={SKELETON_CARD.height} width={SKELETON_CARD.width} />
    ))}
  </div>
);

export type TAllPersonsListProps = {
  isLoading?: boolean;
  initialData?: TPaginatedPersonsResponse;
};

export const AllPersonsList = ({ isLoading = false, initialData }: TAllPersonsListProps = {}) => {
  const { persons, loading, error, hasMore, loadMore } = usePersonsInfiniteScroll({
    initialPage: 1,
    initialLimit: 20,
    initialData,
    suppressInitialLoad: isLoading,
  });

  if (isLoading || (loading && persons.length === 0)) {
    return <PersonsSkeletonGrid count={20} />;
  }

  if (error && persons.length === 0) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <LoadMoreSection
      hasMore={hasMore}
      isLoading={loading}
      loadingComponent={
        <div aria-busy="true" aria-live="polite" className={styles.loadMoreSkeleton} role="status">
          <PersonsSkeletonGrid count={8} />
        </div>
      }
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
