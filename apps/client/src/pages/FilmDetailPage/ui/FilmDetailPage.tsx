"use client"

import React from 'react';
import { Layout } from '@/widgets/Layout';
import { FilmCreatorsViewer } from '@/widgets/FilmCreatorsViewer';
import { FilmDetail, FilmDetailSkeleton } from '@/entities/film';
import { TFilmDetailPageProps } from './types';



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
      <FilmDetail
        film={film}
        creatorsViewer={<FilmCreatorsViewer professions={film.professions} />}
      />
    </Layout>
  );
};
