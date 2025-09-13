import { TFilmModel } from '@common/types';


export interface FilmCardProps {
  film: TFilmModel;
  showIcons?: boolean;
  isLoading?: boolean;
}

export interface FilmCardSkeletonProps {
  showIcons?: boolean;
}

export interface FilmCardPreviewProps {
  film: TFilmModel;
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
  film: TFilmModel;
}
