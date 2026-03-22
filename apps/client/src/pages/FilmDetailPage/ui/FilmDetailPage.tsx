'use client';

import type { TFilmDetailPageProps } from './types';

import React from 'react';

import { FilmDetail, FilmDetailSkeleton } from '@/entities/film';
import { FilmCreatorsViewer } from '@/widgets/FilmCreatorsViewer';
import { Page } from '@/widgets/Layout';

export const FilmDetailPage = ({ isLoading, film }: TFilmDetailPageProps) => {
  if (isLoading) {
    return (
      <Page>
        <FilmDetailSkeleton />
      </Page>
    );
  }

  return (
    <Page>
      <FilmDetail creatorsViewer={<FilmCreatorsViewer />} film={film} />
    </Page>
  );
};
