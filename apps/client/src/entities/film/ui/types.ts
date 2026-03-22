import type { TFilmWithProfessions } from '@common/types';

import type { MouseEvent, ReactNode } from 'react';
export interface FilmCardProps {
  film: TFilmWithProfessions;
  showIcons?: boolean;
  isLoading?: boolean;
}

export interface FilmCardSkeletonProps {
  showIcons?: boolean;
}

export interface FilmCardPreviewProps {
  film: TFilmWithProfessions;
}

export interface IconsBlockProps {
  isFavorite: boolean;
  notLike: boolean;
  handleFavoritesClick: (e: MouseEvent) => void;
  handleSimilarClick: (e: MouseEvent) => void;
  handleGradeClick: (e: MouseEvent) => void;
  handleNotLikeClick: (e: MouseEvent) => void;
}

export interface FilmDetailProps {
  film: TFilmWithProfessions;
  creatorsViewer: ReactNode;
}
