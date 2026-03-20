'use client';

import React from 'react';
import styles from './ProfessionsList.module.scss';
import { getProfessionsWord } from '../../lib';
import { TProfessionsListProps } from './types';
import { ProfessionCard } from '../ProfessionCard'

export const ProfessionsList = ({ professions }: TProfessionsListProps) => {
  if (!professions || professions.length === 0) return null
  const professionsCount = professions.length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>Профессии</div>
        <div className={styles.subtitle}>
          {professionsCount} {getProfessionsWord(professionsCount)}
        </div>
      </div>

      <div className={styles.list}>
        {professions.map((profession) => (
          <ProfessionCard
            key={profession.id}
            profession={profession}
          />
        ))}
      </div>
    </div>
  );
};
