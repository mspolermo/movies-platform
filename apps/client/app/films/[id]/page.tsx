import type { TPageProps } from '@/shared/types';

import { isAxiosError } from 'axios';
import { notFound } from 'next/navigation';

import { getFilmById } from '@/entities/film';
import { FilmDetailPage } from '@/pages/FilmDetailPage';

export default async function FilmPage({ params: { id } }: TPageProps<{ id: string }>) {
  const filmId = Number(id);

  if (!id || Number.isNaN(filmId)) {
    notFound();
  }

  try {
    const film = await getFilmById(filmId);
    return <FilmDetailPage film={film} />;
  } catch (err) {
    if (isAxiosError(err) && err.response?.status === 404) {
      notFound();
    }
    throw err;
  }
}
