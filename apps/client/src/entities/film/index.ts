export { FilmCard, FilmDetail, FilmsCarousel, ShortInfoFilmsList, FilmCardsList } from './ui';
export { formatDuration, resolveFilmPosterUrl } from './lib';
export { getFilmById, getSimilarFilms, searchFilms, getPersonFilms } from './api';
export {
  FilmActionsContext,
  FilmCardActionsContext,
  useFilmActions,
  type TFilmActions,
  type TShareFilmPayload,
} from './model';
