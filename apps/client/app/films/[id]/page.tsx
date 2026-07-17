import type { TPageProps } from '@/shared/types';
import type { TFilmListItemResponse } from '@common/types';

import { isAxiosError } from 'axios';
import { notFound } from 'next/navigation';

import { getFilmById, getSimilarFilms } from '@/entities/film';
import { FilmDetailPage } from '@/pages/FilmDetailPage';

const loadSimilarFilms = async (filmId: number): Promise<TFilmListItemResponse[]> => {
  try {
    return await getSimilarFilms(filmId);
  } catch (error) {
    console.error(`Failed to load similar films for filmId=${filmId}`, error);

    return [];
  }
};

export default async function FilmPage({ params: { id } }: TPageProps<{ id: string }>) {
  const filmId = Number(id);

  if (!id || Number.isNaN(filmId)) {
    notFound();
  }

  try {
    const [film, similarFilms] = await Promise.all([getFilmById(filmId), loadSimilarFilms(filmId)]);

    return <FilmDetailPage film={film} similarFilms={similarFilms} />;
  } catch (err) {
    if (isAxiosError(err) && err.response?.status === 404) {
      notFound();
    }
    throw err;
  }
}
