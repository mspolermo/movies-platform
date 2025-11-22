/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { TPersonBased, TPersonModel } from '@common/types';
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
  const professionsList =
    ((person as TPersonModel).professions ?? []).map((p) => p.name) || [];
  const professionsToShow = professionsList.slice(0, 2);
  const remainingCount = professionsList.length - professionsToShow.length;

  return (
    <article
      className={styles.card}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`Открыть страницу ${nameRu}`}
    >
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.poster}>
            <div className={styles.imageContainer}>
              <img src={photoSrc} alt={nameRu} loading="lazy" />
              {professionsToShow.length > 0 && (
                <div className={styles.professions}>
                  <span>{professionsToShow.join(', ')}</span>
                  {remainingCount > 0 && <span>+{remainingCount}</span>}
                </div>
              )}
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

