import React from 'react';
import { TPersonModel } from '@common/types';
import styles from './PersonHeader.module.scss';

interface PersonHeaderProps {
  person: TPersonModel;
}

export const PersonHeader: React.FC<PersonHeaderProps> = ({ person }) => {
  return (
    <div className={styles.header}>
      <div className={styles.content}>
        <div className={styles.photo}>
          <img src={person.photoUrl} alt={person.nameRu} />
        </div>
        <div className={styles.name}>
          <div className={styles.title}>{person.nameRu}</div>
          {person.nameEn && (
            <div className={styles.subtitle}>{person.nameEn}</div>
          )}
        </div>
      </div>
    </div>
  );
};

