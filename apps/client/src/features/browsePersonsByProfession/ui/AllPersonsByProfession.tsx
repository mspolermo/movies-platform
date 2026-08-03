'use client';

import type { TAllPersonsByProfessionProps } from './types';

import { PersonCardsList } from '@/entities/person';
import { LoadMoreSection } from '@/shared/ui';

import { useProfessionPersons } from '../lib';

/**
 * UI сетка карточек персон по выбранной профессии (с логикой загрузки)
 */
export const AllPersonsByProfession = ({ activeProfessionId }: TAllPersonsByProfessionProps) => {
  const { persons, loading, error, hasMore, loadMore } = useProfessionPersons({
    professionId: activeProfessionId,
    initialPage: 1,
    initialLimit: 20,
  });

  if (!activeProfessionId) return null;

  const listLoading = loading && persons.length === 0;

  return (
    <LoadMoreSection
      hasMore={hasMore}
      isLoading={loading}
      loadingComponent={<PersonCardsList isLoading={true} persons={[]} />}
      onLoadMore={loadMore}
    >
      <PersonCardsList error={error} isLoading={listLoading} persons={persons} />
    </LoadMoreSection>
  );
};
