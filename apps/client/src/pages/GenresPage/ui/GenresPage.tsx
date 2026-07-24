'use client';

import type { TGenresPageProps } from './types';

import { GenresList } from '@/entities/genre';
import { Page } from '@/widgets/Layout';

export const GenresPage = ({ isLoading, genresList }: TGenresPageProps) => {
  const title = 'Жанры';
  const breadcrumbs = [{ label: 'Главная', href: '/' }, { label: title }];

  return (
    <Page breadcrumbs={breadcrumbs} title={title}>
      <GenresList genresList={genresList ?? []} isLoading={Boolean(isLoading)} />
    </Page>
  );
};
