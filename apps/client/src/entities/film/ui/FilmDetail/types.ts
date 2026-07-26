import type { TFilmDetailsResponse } from '@common/types';

import type { ReactNode } from 'react';

export type FilmDetailProps = {
  isLoading?: boolean;
  film?: TFilmDetailsResponse;
  creatorsViewer?: ReactNode;
  /** Панель действий (favorite/rate/share) — инжект из feature. */
  actionsPanel?: ReactNode;
};

/** Секции деталки получают film только после guard в FilmDetail (не loading и film задан). */
export type FilmDetailSectionProps = Required<Pick<FilmDetailProps, 'film'>>;

export type FactsProps = FilmDetailSectionProps;
export type SloganProps = FilmDetailSectionProps;
export type RatingProps = FilmDetailSectionProps;
export type SummaryProps = FilmDetailSectionProps;
export type TrailerProps = FilmDetailSectionProps;
export type DescriptionProps = FilmDetailSectionProps;
export type QualityInfoProps = { view: 'desktop' | 'mobile' };
