import type { TShareFilmPayload, TFilmActions } from '@/entities/film';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { buildLoginHref, useAuth } from '@/entities/user';

import { submitFilmGrade } from '../utils';

type TRateFilmStep = 'rate' | 'success';

type TUseFilmActionsModalsResult = {
  filmActions: TFilmActions;
  isGradeOpen: boolean;
  isShareOpen: boolean;
  gradeStep: TRateFilmStep;
  gradeTitle: string;
  sharePayload: TShareFilmPayload | null;
  handleCloseGrade: () => void;
  handleCloseShare: () => void;
  handleSelectGrade: (grade: number) => void;
};

/**
 * Стейт модалок grade/share + auth-gate с очередью pendingGradeFilmId.
 */
export const useFilmActionsModals = (): TUseFilmActionsModalsResult => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  const [gradeFilmId, setGradeFilmId] = useState<number | null>(null);
  const [pendingGradeFilmId, setPendingGradeFilmId] = useState<number | null>(null);
  const [gradeStep, setGradeStep] = useState<TRateFilmStep>('rate');
  const [sharePayload, setSharePayload] = useState<TShareFilmPayload | null>(null);

  const isGradeOpen = gradeFilmId !== null;
  const isShareOpen = sharePayload !== null;
  const gradeTitle = gradeStep === 'success' ? 'Ваша оценка принята' : 'Ваша оценка';

  const handleCloseGrade = useCallback(() => {
    setGradeFilmId(null);
    setGradeStep('rate');
  }, []);

  const handleCloseShare = useCallback(() => {
    setSharePayload(null);
  }, []);

  const openGradeForAuthenticated = useCallback((id: number) => {
    setSharePayload(null);
    setGradeStep('rate');
    setGradeFilmId(id);
  }, []);

  const openGradeFilm = useCallback(
    (id: number) => {
      if (isLoading) {
        setPendingGradeFilmId(id);
        return;
      }

      setPendingGradeFilmId(null);

      if (!isAuthenticated) {
        router.push(buildLoginHref());
        return;
      }

      openGradeForAuthenticated(id);
    },
    [isAuthenticated, isLoading, openGradeForAuthenticated, router]
  );

  useEffect(() => {
    if (isLoading || pendingGradeFilmId === null) {
      return;
    }

    const id = pendingGradeFilmId;
    setPendingGradeFilmId(null);

    if (!isAuthenticated) {
      router.push(buildLoginHref());
      return;
    }

    openGradeForAuthenticated(id);
  }, [isAuthenticated, isLoading, openGradeForAuthenticated, pendingGradeFilmId, router]);

  const openShareFilm = useCallback((payload: TShareFilmPayload) => {
    setGradeFilmId(null);
    setPendingGradeFilmId(null);
    setGradeStep('rate');
    setSharePayload(payload);
  }, []);

  const handleSelectGrade = useCallback(
    (grade: number) => {
      if (gradeFilmId === null) {
        return;
      }

      // Stub до API: success-шаг — UX-прототип, не подтверждение бэка.
      submitFilmGrade({ filmId: gradeFilmId, grade });
      setGradeStep('success');
    },
    [gradeFilmId]
  );

  const filmActions = useMemo<TFilmActions>(
    () => ({
      openGradeFilm,
      openShareFilm,
    }),
    [openGradeFilm, openShareFilm]
  );

  return {
    filmActions,
    isGradeOpen,
    isShareOpen,
    gradeStep,
    gradeTitle,
    sharePayload,
    handleCloseGrade,
    handleCloseShare,
    handleSelectGrade,
  };
};
