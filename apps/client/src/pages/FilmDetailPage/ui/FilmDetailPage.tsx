'use client';

import type { TFilmDetailPageProps } from './types';

import React from 'react';

import { FilmDetail, FilmsCarousel } from '@/entities/film';
import { SimilarFilmsCarousel } from '@/features/getSimilarFilmsCarousel';
import { FilmActionsPanel } from '@/features/openFilmActions';
import { FilmCommentsViewer } from '@/widgets/FilmCommentsViewer';
import { FilmCreatorsViewer } from '@/widgets/FilmCreatorsViewer';
import { Page } from '@/widgets/Layout';

import { buildFilmBreadcrumbs } from '../lib';

/** Страница фильма с блоком создателей и режимом загрузки */
export const FilmDetailPage = ({ isLoading, film, similarFilms = [] }: TFilmDetailPageProps) => {
  const filmName = film?.filmNameRu || film?.filmNameEn || '';

  return (
    <Page breadcrumbs={buildFilmBreadcrumbs(film)}>
      <FilmDetail
        actionsPanel={film ? <FilmActionsPanel film={film} variant="detail" /> : undefined}
        creatorsViewer={<FilmCreatorsViewer />}
        film={film}
        isLoading={Boolean(isLoading)}
      />
      {isLoading ? (
        <FilmsCarousel isLoading films={[]} title="" />
      ) : (
        <SimilarFilmsCarousel filmName={filmName} films={similarFilms} />
      )}
      <FilmCommentsViewer filmName={filmName} />
    </Page>
  );
};
