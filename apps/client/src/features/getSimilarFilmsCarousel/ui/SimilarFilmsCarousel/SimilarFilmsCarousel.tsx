import type { TSimilarFilmsCarouselProps } from './types';

import { FilmsCarousel } from '@/entities/film';

/**
 * Секция похожих фильмов (данные приходят с RSC page — без waterfall).
 */
export const SimilarFilmsCarousel = ({ filmName, films }: TSimilarFilmsCarouselProps) => {
  return <FilmsCarousel films={films} title={`Похожие на «${filmName}»`} />;
};
