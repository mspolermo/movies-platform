import type { TPageProps } from '@/shared/types';

import { isAxiosError } from 'axios';
import { notFound } from 'next/navigation';

import { getFilmById, getSimilarFilms } from '@/entities/film';
import { FilmDetailPage } from '@/pages/FilmDetailPage';

export default async function FilmPage({ params: { id } }: TPageProps<{ id: string }>) {
  const filmId = Number(id);

  if (!id || Number.isNaN(filmId)) {
    notFound();
  }

  //TODO: посмотреть, че за лет тут вообще
  try {
    const film = await getFilmById(filmId);

    let similarFilms: Awaited<ReturnType<typeof getSimilarFilms>> = [];

    try {
      similarFilms = await getSimilarFilms(film);
    } catch {
      similarFilms = [];
    }

    return <FilmDetailPage film={film} similarFilms={similarFilms} />;
  } catch (err) {
    if (isAxiosError(err) && err.response?.status === 404) {
      notFound();
    }
    throw err;
  }
}
