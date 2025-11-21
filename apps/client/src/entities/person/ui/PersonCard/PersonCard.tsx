'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { TPersonBased } from '@common/types';
import styles from './PersonCard.module.scss';

interface PersonCardProps {
  person: TPersonBased;
}

export const PersonCard: React.FC<PersonCardProps> = ({ person }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/persons/${person.id}`);
  };

  const nameRu = person.nameRu || 'Без имени';
  const nameEn = person.nameEn;
  const photoSrc = person.photoUrl || '/images/poster-placeholder.png';

  return (
    <button
      type="button"
      className={styles.card}
      onClick={handleClick}
      aria-label={`Открыть страницу ${nameRu}`}
    >
      <div className={styles.photoWrapper}>
        <img src={photoSrc} alt={nameRu} loading="lazy" />
      </div>
      <div className={styles.content}>
        <div className={styles.nameRu}>{nameRu}</div>
        {nameEn && <div className={styles.nameEn}>{nameEn}</div>}
      </div>
    </button>
  );
};

