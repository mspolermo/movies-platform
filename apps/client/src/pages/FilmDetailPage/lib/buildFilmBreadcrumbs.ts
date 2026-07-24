import type { TBreadcrumbItem } from '@/shared/ui';
import type { TFilmDetailsResponse } from '@common/types';

/** Trail для страницы фильма: Главная → Фильмы → название. */
export const buildFilmBreadcrumbs = (film?: TFilmDetailsResponse | null): TBreadcrumbItem[] => {
  const home: TBreadcrumbItem = { label: 'Главная', href: '/' };

  if (!film) {
    return [home, { label: 'Фильмы' }];
  }

  const items: TBreadcrumbItem[] = [home, { label: 'Фильмы', href: '/films' }];

  const filmName = film.filmNameRu || film.filmNameEn || '';
  if (filmName) {
    items.push({ label: filmName });
  }

  return items;
};
