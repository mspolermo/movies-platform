import type { TFilmsFilters } from '@/features/filterFilms';
import type { TBreadcrumbItem } from '@/shared/ui';

/**
 * Trail каталога фильмов: Главная → Фильмы [→ один жанр|страна].
 * Years/rating/etc. в крошки не попадают.
 */
export const buildFilmsBreadcrumbs = (selectedFilters: TFilmsFilters): TBreadcrumbItem[] => {
  const home: TBreadcrumbItem = { label: 'Главная', href: '/' };
  const filmsCurrent: TBreadcrumbItem = { label: 'Фильмы' };
  const filmsLink: TBreadcrumbItem = { label: 'Фильмы', href: '/films' };

  const singleGenre =
    selectedFilters.genres.length === 1 && selectedFilters.countries.length === 0
      ? selectedFilters.genres[0]
      : null;

  const singleCountry =
    selectedFilters.countries.length === 1 && selectedFilters.genres.length === 0
      ? selectedFilters.countries[0]
      : null;

  if (singleGenre) {
    return [home, filmsLink, { label: singleGenre }];
  }

  if (singleCountry) {
    return [home, filmsLink, { label: singleCountry }];
  }

  return [home, filmsCurrent];
};
