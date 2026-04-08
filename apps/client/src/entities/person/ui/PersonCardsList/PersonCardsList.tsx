import type { TPersonCardsListProps } from './types';

import styles from './PersonCardsList.module.scss';
import { PersonCard, PersonCardSkeleton } from '../PersonCard';

const SKELETON_PLACEHOLDERS = Array.from({ length: 8 }, (_, i) => i);

/**
 * Сетка карточек персон: ошибка, скелетоны при загрузке, пусто, либо список.
 */
export const PersonCardsList = ({ persons, isLoading, error }: TPersonCardsListProps) => {
  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (isLoading) {
    return (
      <div className={styles.personsGrid}>
        {SKELETON_PLACEHOLDERS.map((index) => (
          <PersonCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (persons.length === 0) {
    return <div className={styles.notFound}>Персоны не найдены</div>;
  }

  return (
    <div className={styles.personsGrid}>
      {persons.map((person) => (
        <PersonCard key={person.id} person={person} />
      ))}
    </div>
  );
};
