'use client';

import type { TFilmsSortingFilterProps } from '../../types';

import { TABLET_BREAKPOINT } from '@/shared/constants';
import { useMediaQuery } from '@/shared/lib';

import { FilmsSortingFilterDesktop } from './FilmsSortingFilterDesktop';
import { FilmsSortingFilterMobile } from './FilmsSortingFilterMobile';

const MOBILE_QUERY = `(max-width: ${TABLET_BREAKPOINT}px)`;

/**
 * Фильтры и соркировка страницы «Фильмы»: десктоп и мобильная вёрстка (как Footer).
 */
export const FilmsSortingFilter = (props: TFilmsSortingFilterProps) => {
  const isMobile = useMediaQuery(MOBILE_QUERY);

  return isMobile ? <FilmsSortingFilterMobile {...props} /> : <FilmsSortingFilterDesktop {...props} />;
};
