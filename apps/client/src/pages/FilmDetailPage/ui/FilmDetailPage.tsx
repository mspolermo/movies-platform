'use client';

import type { TFilmDetailPageProps } from './types';

import React from 'react';

import { FilmDetail } from '@/entities/film';
import { SimilarFilmsCarousel } from '@/features/getSimilarFilmsCarousel';
import { FilmCommentsViewer } from '@/widgets/FilmCommentsViewer';
import { FilmCreatorsViewer } from '@/widgets/FilmCreatorsViewer';
import { Page } from '@/widgets/Layout';

/** Страница фильма с блоком создателей и режимом загрузки */
export const FilmDetailPage = ({ isLoading, film, similarFilms }: TFilmDetailPageProps) => {
  const filmName = film?.filmNameRu || film?.filmNameEn || '';

  return (
    <Page>
      <FilmDetail
        creatorsViewer={<FilmCreatorsViewer />}
        film={film}
        isLoading={Boolean(isLoading)}
      />
      <SimilarFilmsCarousel
        filmName={filmName}
        films={similarFilms ?? []}
        isLoading={Boolean(isLoading)}
      />
      <FilmCommentsViewer filmName={filmName} />
    </Page>
  );
};
