'use client';

import { useParams } from 'next/navigation';

import { FilmCommentsSection } from '@/features/commentOnFilm';

type TFilmCommentsViewerProps = {
  filmName: string;
};

/** Виджет блока отзывов на странице фильма. */
export const FilmCommentsViewer = ({ filmName }: TFilmCommentsViewerProps) => {
  const params = useParams();
  const filmId = Number(params?.id);

  if (!filmId) {
    return null;
  }

  return <FilmCommentsSection filmId={filmId} filmName={filmName} />;
};
