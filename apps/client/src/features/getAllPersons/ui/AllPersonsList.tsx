'use client';

import type { TPaginatedPersonsResponse } from '@common/types';

import { PersonCardsList } from '@/entities/person';
import { LoadMoreSection } from '@/shared/ui';

import { usePersonsInfiniteScroll } from '../lib';

export type TAllPersonsListProps = {
  isLoading?: boolean;
  initialData?: TPaginatedPersonsResponse;
};

/**
 * UI сетка карточек персон (с логикой загрузки)
 */
export const AllPersonsList = ({ isLoading = false, initialData }: TAllPersonsListProps = {}) => {
  const { persons, loading, error, hasMore, loadMore } = usePersonsInfiniteScroll({
    initialPage: 1,
    initialLimit: 20,
    initialData,
  });

  const listLoading = isLoading || (loading && persons.length === 0);

  return (
    <LoadMoreSection
      hasMore={hasMore && !isLoading}
      isLoading={loading}
      loadingComponent={<PersonCardsList isLoading={true} persons={[]} />}
      onLoadMore={loadMore}
    >
      <PersonCardsList error={error} isLoading={listLoading} persons={persons} />
    </LoadMoreSection>
  );
};
