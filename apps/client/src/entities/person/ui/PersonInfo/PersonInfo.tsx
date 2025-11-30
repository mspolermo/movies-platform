import React from 'react';
import { TPersonModel } from '@common/types';
import styles from './PersonInfo.module.scss';
import { TPersonInfoProps } from './types';

export const PersonInfo = ({ person }: TPersonInfoProps) => {
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

