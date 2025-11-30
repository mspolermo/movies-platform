'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './ProfessionsList.module.scss';
import { getProfessionsWord } from '../../lib';
import { TProfessionsListProps } from './types';

export const ProfessionsList = ({ professions }: TProfessionsListProps) => {
  const router = useRouter();

  if (!professions || professions.length === 0) return null
  const professionsCount = professions.length;

  const handleProfessionClick = (professionName: string) => {
    router.push(`/professions?profession=${encodeURIComponent(professionName)}`);
  };

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
