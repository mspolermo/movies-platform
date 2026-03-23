import type { TFilmDetailsResponse } from '@common/types';

import type { ReactNode } from 'react';

export interface DescriptionBlockProps
  extends Pick<
    TFilmDetailsResponse,
    'description' | 'filmNameRu' | 'filmNameEn'
  > {}

export interface PosterPreviewBlockProps
  extends Pick<
    TFilmDetailsResponse,
    'bigPictureUrl' | 'smallPictureUrl' | 'filmNameRu' | 'filmNameEn'
  > {}

export interface RatingBlockProps
  extends Pick<
    TFilmDetailsResponse,
    'ratingKp' | 'votesKp' | 'filmNameRu' | 'filmNameEn'
  > {}

export interface SloganBlockProps
  extends Pick<TFilmDetailsResponse, 'slogan'> {}

export interface SummaryBlockProps
  extends Pick<
    TFilmDetailsResponse,
    'filmNameRu' | 'filmNameEn' | 'year' | 'movieLength'
  > {
  genres?: TFilmDetailsResponse['genres'];
  isCartoon: boolean;
  countries?: TFilmDetailsResponse['countries'];
}

export interface TrailerBlockProps
  extends Pick<
    TFilmDetailsResponse,
    'trailerUrl' | 'filmNameRu' | 'filmNameEn'
  > {}

export interface FactBlockProps {
  facts?: TFilmDetailsResponse['facts'];
  isCartoon: boolean;
}

export interface TCreatorsViewerBlockProps {
  creatorsViewer: ReactNode;
}
