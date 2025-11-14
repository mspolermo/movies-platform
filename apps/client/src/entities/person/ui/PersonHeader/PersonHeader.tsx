import React from 'react';
import { TPersonModel } from '@common/types';
import styles from './PersonHeader.module.scss';

interface PersonHeaderProps {
  person: TPersonModel;
}

export const PersonHeader: React.FC<PersonHeaderProps> = ({ person }) => {

  return (
    <div className={styles.actorHeader}>
      <div className={styles.actorHeader__content}>
        <div className={styles.actorHeader__foto}>
          <img 
            src={person.photoUrl} 
            alt={person.nameRu}
          />
        </div>
        <div className={styles.name}>
          <div className={styles.name__title}>{person.nameRu}</div>
          {person.nameEn && (
            <div className={styles.name__subtitle}>{person.nameEn}</div>
          )}
        </div>
      </div>
    </div>
  );
};

