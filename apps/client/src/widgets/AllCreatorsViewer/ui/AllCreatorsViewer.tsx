'use client';

import type { TAllCreatorsViewerProps } from '../models';

import { ProfessionsSlider } from '@/entities/profession';
import { AllPersonsByProfession } from '@/features/getAllPersonsByProfession';

import { useAllCreatorsView } from '../lib';
import styles from './AllCreatorsViewer.module.scss';

/**
 * UI-виджет для просмотра всех персон разбитых по профессиям на слайдере (с загрузкой данных)
 */
export const AllCreatorsViewer = (props: TAllCreatorsViewerProps) => {
  const { professions, activeProfessionId, handleProfessionChange } = useAllCreatorsView(props);

  if (professions.length === 0) {
    return <div className={styles.emptyState}>Нет доступных профессий</div>;
  }

  return (
    <div className={styles.content}>
      <ProfessionsSlider
        activeProfessionId={activeProfessionId}
        professions={professions}
        onProfessionChange={handleProfessionChange}
      />

      <AllPersonsByProfession activeProfessionId={activeProfessionId} />
    </div>
  );
};
