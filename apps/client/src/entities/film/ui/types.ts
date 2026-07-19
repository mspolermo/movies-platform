import type { TFilmListItemResponse } from '@common/types';

import type { MouseEvent } from 'react';
export interface FilmCardProps {
  film: TFilmListItemResponse;
  showIcons?: boolean;
  isLoading?: boolean;
  /** LCP: eager load для above-the-fold постеров. */
  priority?: boolean;
}

export interface FilmCardSkeletonProps {
  showIcons?: boolean;
}

export interface FilmCardPreviewProps {
  film: TFilmListItemResponse;
  priority?: boolean;
}

export interface IconsBlockProps {
  isFavorite: boolean;
  notLike: boolean;
  handleFavoritesClick: (e: MouseEvent) => void;
  handleSimilarClick: (e: MouseEvent) => void;
  handleGradeClick: (e: MouseEvent) => void;
  handleNotLikeClick: (e: MouseEvent) => void;
}
