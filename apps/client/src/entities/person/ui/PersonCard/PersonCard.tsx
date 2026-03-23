'use client';

import type { TPersonListItemResponse } from '@common/types';

import { useRouter } from 'next/navigation';

import styles from './PersonCard.module.scss';

interface PersonCardProps {
  person: TPersonListItemResponse;
}

export const PersonCard = ({ person }: PersonCardProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/persons/${person.id}`);
  };

  const nameRu = person.nameRu || 'Без имени';
  const nameEn = person.nameEn;
  const photoSrc = person.photoUrl || '/images/poster-placeholder.png';

  return (
    <article
      aria-label={`Открыть страницу ${nameRu}`}
      className={styles.card}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.poster}>
            <div className={styles.imageContainer}>
              {/* eslint-disable-next-line @next/next/no-img-element -- внешние URL фото */}
              <img alt={nameRu} loading="lazy" src={photoSrc} />
            </div>
          </div>
        </div>
        <div className={styles.info}>
          <div className={styles.nameRu}>{nameRu}</div>
          {nameEn && <div className={styles.nameEn}>{nameEn}</div>}
        </div>
      </div>
    </article>
  );
};
