type FilmPosterUrls = {
  smallPictureUrl?: string | null;
  bigPictureUrl?: string | null;
};

type FilmPosterPreference = 'small' | 'big';

/** Выбирает URL постера: small→big или big→small. */
export const resolveFilmPosterUrl = (
  film: FilmPosterUrls,
  preference: FilmPosterPreference = 'small'
): string => {
  const small = film.smallPictureUrl?.trim() || '';
  const big = film.bigPictureUrl?.trim() || '';

  if (preference === 'big') {
    return big || small;
  }

  return small || big;
};
