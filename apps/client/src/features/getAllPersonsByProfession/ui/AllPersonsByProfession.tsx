import { PersonCard } from '@/entities/person';
import { LoadMoreSection, Loader } from '@/shared/ui';
import styles from './AllPersonsByProfession.module.scss';
import { TAllPersonsByProfessionProps } from './types';
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

  if (!activeProfessionId) return null

  return (
    <div className={styles.personsSection}>
      {personsError && (
        <div className={styles.error}>{personsError}</div>
      )}

      {persons.length === 0 && !personsLoading && (
        <div className={styles.emptyState}>
          Нет персон в этой профессии
        </div>
      )}

      <LoadMoreSection
        onLoadMore={loadMore}
        isLoading={personsLoading}
        hasMore={hasMore}
        className={styles.infiniteScroll}
      >
        <div className={styles.personsGrid}>
          {persons.map((person) => (
            <PersonCard key={person.id} person={person} />
          ))}
        </div>
      </LoadMoreSection>
    </div>
  )
}