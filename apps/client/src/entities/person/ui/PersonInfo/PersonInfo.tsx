import type { TPersonInfoProps } from './types';

import React from 'react';

import styles from './PersonInfo.module.scss';

export const PersonInfo = ({ person }: TPersonInfoProps) => {
  return (
    <div className={styles.content}>
      {/* eslint-disable-next-line @next/next/no-img-element -- внешние URL фото */}
      <img alt={person.nameRu} className={styles.photo} src={person.photoUrl} />

      <div className={styles.name}>
        <h1 className={styles.title}>{person.nameRu}</h1>
        {person.nameEn && <h2 className={styles.subtitle}>{person.nameEn}</h2>}
      </div>
    </div>
  );
};
