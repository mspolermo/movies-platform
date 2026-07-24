import type { TSubmitFilmGradeParams } from '../model';

/**
 * Заглушка отправки оценки. Позже заменить на API.
 */
export const submitFilmGrade = ({ filmId, grade }: TSubmitFilmGradeParams): void => {
  // eslint-disable-next-line no-console -- временная заглушка до API
  console.log('[rateFilm] submitFilmGrade', { filmId, grade });
};
