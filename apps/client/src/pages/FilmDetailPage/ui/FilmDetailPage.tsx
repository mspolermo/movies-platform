'use client';

import type { TFilmDetailPageProps } from './types';

import React from 'react';

import { FilmDetail } from '@/entities/film';
import { FilmCommentsViewer } from '@/widgets/FilmCommentsViewer';
import { FilmCreatorsViewer } from '@/widgets/FilmCreatorsViewer';
import { Page } from '@/widgets/Layout';

/** Страница фильма с блоком создателей и режимом загрузки */
export const FilmDetailPage = ({ isLoading, film }: TFilmDetailPageProps) => (
  <Page>
    <FilmDetail
      creatorsViewer={<FilmCreatorsViewer />}
      film={film}
      isLoading={Boolean(isLoading)}
    />
    <FilmCommentsViewer filmName={film?.filmNameRu || film?.filmNameEn || ''} />
  </Page>
);
