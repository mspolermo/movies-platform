'use client';

import type { ReactNode } from 'react';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import { FilmGradeActionContext } from '@/entities/film';
import { useAuth } from '@/entities/user';
import { Modal } from '@/shared/ui';

import { RateFilmContent } from './RateFilmContent';
import styles from './RateFilmProvider.module.scss';
import { RateFilmSuccess } from './RateFilmSuccess';
import { submitFilmGrade } from '../lib';

type TRateFilmProviderProps = {
  children: ReactNode;
};

type TRateFilmStep = 'rate' | 'success';

/**
 * Инжектит openGradeFilm через entity-context и рендерит одну Modal на дерево.
 */
export const RateFilmProvider = ({ children }: TRateFilmProviderProps) => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [filmId, setFilmId] = useState<number | null>(null);
  const [step, setStep] = useState<TRateFilmStep>('rate');

  const isOpen = filmId !== null;
  const title = step === 'success' ? 'Ваша оценка принята' : 'Ваша оценка';

  const handleClose = useCallback(() => {
    setFilmId(null);
    setStep('rate');
  }, []);

  const openGradeFilm = useCallback(
    (id: number) => {
      if (isLoading) {
        return;
      }

      if (!isAuthenticated) {
        router.push('/auth/login');
        return;
      }

      setStep('rate');
      setFilmId(id);
    },
    [isAuthenticated, isLoading, router]
  );

  const handleSelectGrade = useCallback(
    (grade: number) => {
      if (filmId === null) {
        return;
      }

      // Stub до API: success-шаг — UX-прототип, не подтверждение бэка.
      submitFilmGrade({ filmId, grade });
      setStep('success');
    },
    [filmId]
  );

  return (
    <FilmGradeActionContext.Provider value={openGradeFilm}>
      {children}
      <Modal
        aria-label="Оценка фильма"
        className={styles.rateModal}
        contentClassName={styles.rateOverlayContent}
        headerClassName={styles.rateModalHeader}
        isOpen={isOpen}
        overlayClassName={styles.rateOverlay}
        title={title}
        titleClassName={styles.rateModalTitle}
        onClose={handleClose}
      >
        {step === 'success' ? (
          <RateFilmSuccess />
        ) : (
          <RateFilmContent onSelect={handleSelectGrade} />
        )}
      </Modal>
    </FilmGradeActionContext.Provider>
  );
};
