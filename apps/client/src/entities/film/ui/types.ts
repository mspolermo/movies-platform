import type {
  TFilmListItemResponse,
  TFilmDetailsResponse,
} from '@common/types';

import type { MouseEvent, ReactNode } from 'react';
export interface FilmCardProps {
  film: TFilmListItemResponse;
  showIcons?: boolean;
  isLoading?: boolean;
}

export interface FilmCardSkeletonProps {
  showIcons?: boolean;
}

export interface FilmCardPreviewProps {
  film: TFilmListItemResponse;
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
  film: TFilmDetailsResponse;
  creatorsViewer: ReactNode;
}
