'use client';

import type { TGenresPageProps } from './types';

import { GenresList } from '@/entities/genre';
import { Page } from '@/widgets/Layout';

export const GenresPage = ({ isLoading, genresList }: TGenresPageProps) => (
  <Page title="Жанры">
    <GenresList genresList={genresList ?? []} isLoading={Boolean(isLoading)} />
  </Page>
);
