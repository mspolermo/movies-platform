'use client';

import type { TProfessionsListProps } from './types';

import React from 'react';

import styles from './ProfessionsList.module.scss';
import { getProfessionsWord } from '../../lib';
import { ProfessionCard } from '../ProfessionCard';

/** Список профессий персоны: заголовок, число и карточки (или пустое состояние). */
export const ProfessionsList = ({ professions }: TProfessionsListProps) => {
  const items = professions ?? [];
  const professionsCount = items.length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>Профессии</div>
        <div className={styles.subtitle}>
          {professionsCount} {getProfessionsWord(professionsCount)}
        </div>
      </div>

      <div className={styles.list}>
        {items.length > 0 ? (
          items.map((profession) => <ProfessionCard key={profession.id} profession={profession} />)
        ) : (
          <div className={styles.empty}>Профессии не указаны</div>
        )}
      </div>
    </div>
  );
};
