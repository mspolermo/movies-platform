import { AllPersonsByProfession } from '@/features/getAllPersonsByProfession'
import { useAllCreatorsView } from '../lib'
import styles from './AllCreatorsViewer.module.scss'
import { ProfessionsSlider } from '@/entities/profession'
import { TAllCreatorsViewerProps } from './types'
import { Loader } from '@/shared/ui'

/**
 * UI-виджет для просмотра всех персон разбитых по профессиям на слайдере (с загрузкой данных)
 */
export const AllCreatorsViewer = ({searchParams }: TAllCreatorsViewerProps) => {
  const { professions, activeProfessionId, loading, error, handleProfessionChange } = useAllCreatorsView({ searchParams })

  if (loading) {
    return (
        <div className={styles.loaderWrapper}>
          <Loader size="small" />
        </div>
    );
  }

  if (error) {
    return (
        <div className={styles.error}>{error}</div>
    );
  }

  return (
    <div className={styles.container}>
        <h1 className={styles.title}>Профессии</h1>

        {professions.length > 0 && (
          <div className={styles.content}>
            <ProfessionsSlider
              professions={professions}
              activeProfessionId={activeProfessionId}
              onProfessionChange={handleProfessionChange}
            />

            <AllPersonsByProfession activeProfessionId={activeProfessionId}/>
          </div>
        )}

        {professions.length === 0 && (
          <div className={styles.emptyState}>Нет доступных профессий</div>
        )}
      </div>
  )
}