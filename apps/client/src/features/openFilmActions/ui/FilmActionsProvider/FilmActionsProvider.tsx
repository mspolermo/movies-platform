'use client';

import type { TFilmActionsProviderProps } from './types';
import type { TFilmListItemResponse } from '@common/types';

import { useCallback } from 'react';

import { FilmActionsContext, FilmCardActionsContext, FilmMyRatingContext } from '@/entities/film';
import { Modal } from '@/shared/ui';

import styles from './FilmActionsProvider.module.scss';
import { useFilmActionsModals } from '../../lib';
import { FilmActionsPanel } from '../FilmActionsPanel';
import { RateFilmContent } from '../RateFilmContent';
import { RateFilmSuccess } from '../RateFilmSuccess';
import { ShareFilmPanel } from '../ShareFilmPanel';

/**
 * Инжектит film actions (grade/share + ratings + card overlay) и модалки.
 */
export const FilmActionsProvider = ({ children }: TFilmActionsProviderProps) => {
  const {
    filmActions,
    filmMyRating,
    isGradeOpen,
    isShareOpen,
    gradeStep,
    gradeTitle,
    selectedGrade,
    gradeError,
    isGradeSubmitting,
    sharePayload,
    handleCloseGrade,
    handleCloseShare,
    handleSelectGrade,
    handleDeleteGrade,
  } = useFilmActionsModals();

  const renderCardActions = useCallback(
    (film: TFilmListItemResponse) => <FilmActionsPanel film={film} variant="card" />,
    []
  );

  return (
    <FilmActionsContext.Provider value={filmActions}>
      <FilmMyRatingContext.Provider value={filmMyRating}>
        <FilmCardActionsContext.Provider value={renderCardActions}>
          {children}

          <Modal
            aria-label="Оценка фильма"
            className={styles.rateModal}
            contentClassName={styles.rateOverlayContent}
            headerClassName={styles.rateModalHeader}
            isOpen={isGradeOpen}
            overlayClassName={styles.rateOverlay}
            title={gradeTitle}
            titleClassName={styles.rateModalTitle}
            onClose={handleCloseGrade}
          >
            {gradeStep === 'success' ? (
              <RateFilmSuccess />
            ) : (
              <RateFilmContent
                error={gradeError}
                isSubmitting={isGradeSubmitting}
                selectedGrade={selectedGrade}
                onDelete={selectedGrade != null ? handleDeleteGrade : undefined}
                onSelect={handleSelectGrade}
              />
            )}
          </Modal>

          <Modal
            aria-label="Поделиться фильмом"
            className={styles.shareModal}
            contentClassName={styles.shareOverlayContent}
            headerClassName={styles.shareModalHeader}
            isOpen={isShareOpen}
            title="Поделиться"
            titleClassName={styles.shareModalTitle}
            onClose={handleCloseShare}
          >
            {sharePayload ? <ShareFilmPanel payload={sharePayload} /> : null}
          </Modal>
        </FilmCardActionsContext.Provider>
      </FilmMyRatingContext.Provider>
    </FilmActionsContext.Provider>
  );
};
