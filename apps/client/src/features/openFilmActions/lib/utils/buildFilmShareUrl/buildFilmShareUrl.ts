/**
 * Публичный URL страницы фильма для шаринга.
 */
export const buildFilmShareUrl = (filmId: number): string => {
  if (typeof window === 'undefined') {
    return `/films/${filmId}`;
  }

  return `${window.location.origin}/films/${filmId}`;
};
