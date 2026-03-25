import type { TPersonDetailProps } from './types';

import { Filmography } from '@/entities/film';
import { PersonInfo, PersonInfoSkeleton } from '@/entities/person';
import { ProfessionsList } from '@/entities/profession';

import { usePersonDetails } from '../lib';
import styles from './PersonDetail.module.scss';

//TODO: добавить адаптив
export const PersonDetail = ({ personId }: TPersonDetailProps) => {
  const { loading, error, person, filmsTotal, films, handleLoadMore, isLoadingMore, hasMoreFilms } =
    usePersonDetails(personId);

  if (loading) {
    return (
      <div className={styles.loaderWrapper}>
        <PersonInfoSkeleton />
      </div>
    );
  }

  if (error || !person) {
    return (
      <div className={styles.errorWrapper}>
        <div className={styles.errorMessage}>{error || 'Персона не найдена'}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <PersonInfo person={person} />

      <ProfessionsList professions={person.professions} />

      <Filmography
        films={films}
        filmsTotal={filmsTotal}
        hasMoreFilms={hasMoreFilms}
        isLoading={isLoadingMore}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
};
