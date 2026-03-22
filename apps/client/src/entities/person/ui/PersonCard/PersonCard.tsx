'use client';

import type { TPersonBased, TPersonModel } from '@common/types';

import { useRouter } from 'next/navigation';

import styles from './PersonCard.module.scss';

interface PersonCardProps {
  person: TPersonBased;
}

export const PersonCard = ({ person }: PersonCardProps) => {
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
