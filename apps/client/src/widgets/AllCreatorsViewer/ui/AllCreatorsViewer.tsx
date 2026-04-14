'use client';

import type { TAllCreatorsViewerProps, TAllCreatorsViewerReadyProps } from '../models';

import { PersonCardsList } from '@/entities/person';
import { ProfessionsSlider, ProfessionsSliderSkeleton } from '@/entities/profession';
import { AllPersonsByProfession } from '@/features/getAllPersonsByProfession';

import { useAllCreatorsView } from '../lib';
import styles from './AllCreatorsViewer.module.scss';

const AllCreatorsViewerContent = (props: TAllCreatorsViewerReadyProps) => {
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

/**
 * UI-виджет для просмотра всех персон разбитых по профессиям на слайдере (с загрузкой данных)
 */
export const AllCreatorsViewer = (props: TAllCreatorsViewerProps) => {
  if (props.isLoading) {
    return (
      <div className={styles.content}>
        <ProfessionsSliderSkeleton />

        <div className={styles.personsSection}>
          <PersonCardsList isLoading persons={[]} />
        </div>
      </div>
    );
  }

  return <AllCreatorsViewerContent {...props} />;
};
