import { TFilmWithProfessions } from '@common/types';
import { ReactNode } from 'react';

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
  handleFavoritesClick: (e: React.MouseEvent) => void;
  handleSimilarClick: (e: React.MouseEvent) => void;
  handleGradeClick: (e: React.MouseEvent) => void;
  handleNotLikeClick: (e: React.MouseEvent) => void;
}

export interface FilmDetailProps {
  film: TFilmWithProfessions;
  creatorsViewer: ReactNode
}
