import React from 'react';
import styles from './PersonInfo.module.scss';
import { TPersonInfoProps } from './types';

export const PersonInfo = ({ person }: TPersonInfoProps) => {

  return (
    <div className={styles.content}>

      <img
        src={person.photoUrl}
        className={styles.photo}
        alt={person.nameRu}
      />

      <div className={styles.name}>
        <h1 className={styles.title}>{person.nameRu}</h1>
        {person.nameEn && (
          <h2 className={styles.subtitle}>{person.nameEn}</h2>
        )}
      </div>
    </div>
  );
};

