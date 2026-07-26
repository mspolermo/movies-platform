import type { TSubmitFilmGradeParams } from '../../../model';

import { debugStubLog } from '@/shared/lib';

/**
 * Заглушка отправки оценки. Позже заменить на API.
 */
export const submitFilmGrade = ({ filmId, grade }: TSubmitFilmGradeParams): void => {
  debugStubLog('[openFilmActions] submitFilmGrade', { filmId, grade });
};
