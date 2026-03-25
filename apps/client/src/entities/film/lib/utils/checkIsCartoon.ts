import type { TFilmDetailsResponse } from '@common/types';

export const checkIsCartoon = (genres: TFilmDetailsResponse['genres']): boolean => {
  if (!genres) return false;

  return genres.some((g) => {
    const ru = g.nameRu?.toLowerCase() || '';
    const en = g.nameEn?.toLowerCase() || '';

    // Проверяем русские названия
    const ruPatterns = ['мультфильм', 'анимация', 'анимационный', 'мультипликация'];

    // Проверяем английские названия
    const enPatterns = ['animation', 'cartoon', 'animated', 'anime'];

    return (
      ruPatterns.some((pattern) => ru.includes(pattern)) ||
      enPatterns.some((pattern) => en.includes(pattern))
    );
  });
};
