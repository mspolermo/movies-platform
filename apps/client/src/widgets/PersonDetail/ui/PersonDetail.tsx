import type { TPersonDetailProps } from './types';

import { PersonInfo } from '@/entities/person';
import personInfoStyles from '@/entities/person/ui/PersonInfo/PersonInfo.module.scss';
import { ProfessionsList } from '@/entities/profession';
import { PersonFilmography } from '@/features/browsePersonFilmography';
import { Skeleton } from '@/shared/ui';

import styles from './PersonDetail.module.scss';

/** Карточка персоны: скелетон при загрузке, ошибка если нет данных, иначе инфо, профессии и фильмография. */
export const PersonDetail = (props: TPersonDetailProps) => {
  const { isLoading, person } = props;

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={personInfoStyles.content}>
          <Skeleton borderRadius={16} className={personInfoStyles.photo} />

          <div className={personInfoStyles.name}>
            <Skeleton height={28} width="100%" />
            <Skeleton height={22} width="100%" />
          </div>
        </div>

        <Skeleton height="100px" width="100%" />
        <Skeleton height="400px" width="100%" />
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
