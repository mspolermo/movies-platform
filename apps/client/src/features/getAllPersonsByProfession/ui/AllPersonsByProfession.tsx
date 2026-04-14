import type { TAllPersonsByProfessionProps } from './types';

import { PersonCard, PersonCardsList } from '@/entities/person';
import { LoadMoreSection } from '@/shared/ui';

import styles from './AllPersonsByProfession.module.scss';
import { useProfessionPersons } from '../lib';

/**
 * UI сетка больших карточек персон по выбранной професии (с логикой загрузки)
 */
export const AllPersonsByProfession = ({ activeProfessionId }: TAllPersonsByProfessionProps) => {
  const {
    persons,
    loading: personsLoading,
    error: personsError,
    hasMore,
    loadMore,
  } = useProfessionPersons({
    professionId: activeProfessionId,
    initialPage: 1,
    initialLimit: 20,
  });

  if (!activeProfessionId) return null;

  return (
    <div className={styles.personsSection}>
      {personsError && <div className={styles.error}>{personsError}</div>}

      {persons.length === 0 && !personsLoading && (
        <div className={styles.emptyState}>Нет персон в этой профессии</div>
      )}

      <LoadMoreSection
        className={styles.infiniteScroll}
        hasMore={hasMore}
        isLoading={personsLoading}
        loadingComponent={personsLoading && persons.length === 0 ? null : undefined}
        onLoadMore={loadMore}
      >
        {personsLoading && persons.length === 0 ? (
          <PersonCardsList isLoading persons={[]} />
        ) : (
          <div className={styles.personsGrid}>
            {persons.map((person) => (
              <PersonCard key={person.id} person={person} />
            ))}
          </div>
        )}
      </LoadMoreSection>
    </div>
  );
};
