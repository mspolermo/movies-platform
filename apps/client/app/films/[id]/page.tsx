import type { TPageProps } from '@/shared/types';

import { notFound } from 'next/navigation';

import { getFilmById } from '@/entities/film';
import { FilmDetailPage } from '@/pages/FilmDetailPage';

export default async function FilmPage({ params: { id } }: TPageProps<{ id: string }>) {
  const filmId = Number(id);

  if (!id || Number.isNaN(filmId)) {
    notFound();
  }

  const film = await getFilmById(filmId);

  return <FilmDetailPage film={film} />;
}
