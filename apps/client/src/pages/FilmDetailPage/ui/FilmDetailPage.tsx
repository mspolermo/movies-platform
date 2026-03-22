'use client';

import type { TFilmDetailPageProps } from './types';

import React from 'react';

import { FilmDetail, FilmDetailSkeleton } from '@/entities/film';
import { FilmCreatorsViewer } from '@/widgets/FilmCreatorsViewer';
import { Layout } from '@/widgets/Layout';

export const FilmDetailPage = ({ isLoading, film }: TFilmDetailPageProps) => {
  if (isLoading) {
    return (
      <Layout>
        <FilmDetailSkeleton />
      </Layout>
    );
  }

  return (
    <Layout>
      <FilmDetail creatorsViewer={<FilmCreatorsViewer />} film={film} />
    </Layout>
  );
};
