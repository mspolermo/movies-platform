import { notFound } from 'next/navigation';

import { getFilmById } from '@/entities/film';
import { FilmDetailPage } from '@/pages/FilmDetailPage';
import { TPageProps } from '@/shared/types';

export default async function FilmPage({
  params: { id },
}: TPageProps<{ id: string }>) {
  const filmId = Number(id);

  if (!id || Number.isNaN(filmId)) {
    notFound();
  }

  const film = await getFilmById(filmId);

  if (!film) {
    notFound();
  }

  return <FilmDetailPage film={film}/>;
}