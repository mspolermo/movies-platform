import { notFound } from 'next/navigation';

import { getGenresList } from '@/entities/genre';
import { GenresPage } from '@/pages/GenresPage';

export default async function GenresPageRoute() {
  const genresList = await getGenresList();

  if (!genresList) {
    notFound();
  }

  return <GenresPage genresList={genresList} />;
}
