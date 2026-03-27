import type { TPersonDetailProps } from './types';

import { PersonInfo, PersonInfoSkeleton } from '@/entities/person';
import { ProfessionsList } from '@/entities/profession';
import { PersonFilmography } from '@/features/getPersonFilmography';

import styles from './PersonDetail.module.scss';

export const PersonDetail = (props: TPersonDetailProps) => {
  const { isLoading, person } = props;

  if (isLoading) {
    return (
      <div className={styles.loaderWrapper}>
        <PersonInfoSkeleton />
      </div>
    );
  }

  if (!person) {
    return (
      <div className={styles.errorWrapper}>
        <div className={styles.errorMessage}>Персона не найдена</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <PersonInfo person={person} />
      <ProfessionsList professions={person.professions} />
      <PersonFilmography personId={person.id} />
    </div>
  );
};
