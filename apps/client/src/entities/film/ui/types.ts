import { TFilmBased } from '@common/types';


export interface FilmCardProps {
  film: TFilmBased;
  showIcons?: boolean;
  isLoading?: boolean;
}

export interface FilmCardSkeletonProps {
  showIcons?: boolean;
}

export interface FilmCardPreviewProps {
  film: TFilmBased;
}

export interface IconsBlockProps {
  isFavorite: boolean;
  notLike: boolean;
  handleFavoritesClick: (e: React.MouseEvent) => void;
  handleSimilarClick: (e: React.MouseEvent) => void;
  handleGradeClick: (e: React.MouseEvent) => void;
  handleNotLikeClick: (e: React.MouseEvent) => void;
}