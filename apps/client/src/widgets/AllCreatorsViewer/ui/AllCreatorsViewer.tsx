import type { TAllCreatorsViewerProps } from '../models';

import { ProfessionsSlider } from '@/entities/profession';
import { AllPersonsByProfession } from '@/features/getAllPersonsByProfession';
import { Loader } from '@/shared/ui';

import { useAllCreatorsView } from '../lib';
import styles from './AllCreatorsViewer.module.scss';

/**
 * UI-виджет для просмотра всех персон разбитых по профессиям на слайдере (с загрузкой данных)
 */
export const AllCreatorsViewer = ({
  searchParams,
}: TAllCreatorsViewerProps) => {
  const {
    professions,
    activeProfessionId,
    loading,
    error,
    handleProfessionChange,
  } = useAllCreatorsView({ searchParams });

  if (loading) {
    return (
      <div className={styles.loaderWrapper}>
        <Loader size="small" />
      </div>
    );
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <>
      {professions.length > 0 && (
        <div className={styles.content}>
          <ProfessionsSlider
            activeProfessionId={activeProfessionId}
            professions={professions}
            onProfessionChange={handleProfessionChange}
          />

          <AllPersonsByProfession activeProfessionId={activeProfessionId} />
        </div>
      )}

      {professions.length === 0 && (
        <div className={styles.emptyState}>Нет доступных профессий</div>
      )}
    </>
  );
};
