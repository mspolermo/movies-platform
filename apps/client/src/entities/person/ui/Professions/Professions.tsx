'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { TProfessionBased } from '@common/types';
import styles from './Professions.module.scss';
import { ProfessionsProps } from '../types';

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
  const router = useRouter();
  const professionsCount = professions.length;

  const handleProfessionClick = (professionName: string) => {
    router.push(`/professions?profession=${encodeURIComponent(professionName)}`);
  };

  if (professionsCount === 0) {
    return null;
  }

  return (
    <div className={styles.professions}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.title}>Профессии</div>
          <div className={styles.subtitle}>
            {professionsCount} {getProfessionsWord(professionsCount)}
          </div>
        </div>

        <div className={styles.list}>
          {professions.map((profession) => (
            <button
              key={profession.id}
              type="button"
              className={styles.item}
              onClick={() => handleProfessionClick(profession.name)}
            >
              {profession.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
