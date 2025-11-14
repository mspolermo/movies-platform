import React from 'react';
import { TProfessionBased } from '@common/types';
import styles from './Professions.module.scss';

interface ProfessionsProps {
  professions: TProfessionBased[];
}

const getProfessionsWord = (count: number): string => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'профессий';
  }

  if (lastDigit === 1) {
    return 'профессия';
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'профессии';
  }

  return 'профессий';
};

export const Professions: React.FC<ProfessionsProps> = ({ professions }) => {
  const professionsCount = professions.length;

  if (professionsCount === 0) {
    return null;
  }

  return (
    <div className={styles.professions}>
      <div className={styles.professions__content}>
        <div className={styles.professions__header}>
          <div className={styles.professions__title}>Профессии</div>
          <div className={styles.professions__subtitle}>
            {professionsCount} {getProfessionsWord(professionsCount)}
          </div>
        </div>

        <div className={styles.professions__list}>
          {professions.map((profession) => (
            <div key={profession.id} className={styles.professions__item}>
              {profession.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

