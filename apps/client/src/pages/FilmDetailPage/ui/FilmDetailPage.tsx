'use client';

import type { TFilmDetailPageProps } from './types';

import React from 'react';

import { FilmDetail } from '@/entities/film';
import { FilmCreatorsViewer } from '@/widgets/FilmCreatorsViewer';
import { Page } from '@/widgets/Layout';

export const FilmDetailPage = ({ isLoading, film }: TFilmDetailPageProps) => (
  <Page>
    <FilmDetail
      creatorsViewer={<FilmCreatorsViewer />}
      film={film}
      isLoading={Boolean(isLoading)}
    />
  </Page>
);
