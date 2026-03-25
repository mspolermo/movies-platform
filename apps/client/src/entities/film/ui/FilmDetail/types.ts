import type { TFilmDetailsResponse } from '@common/types';

import type { ReactNode } from 'react';

export type FilmDetailProps = {
  isLoading?: boolean;
  film?: TFilmDetailsResponse;
  creatorsViewer?: ReactNode;
};

export type FactsProps = Pick<FilmDetailProps, 'film'>;
export type PosterProps = Pick<FilmDetailProps, 'film'>;
export type SloganProps = Pick<FilmDetailProps, 'film'>;
export type RatingProps = Pick<FilmDetailProps, 'film'>;
export type SummaryProps = Pick<FilmDetailProps, 'film'>;
export type TrailerProps = Pick<FilmDetailProps, 'film'>;
export type DescriptionProps = Pick<FilmDetailProps, 'film'>;
export type QualityInfoProps = { view: 'desktop' | 'mobile' };
