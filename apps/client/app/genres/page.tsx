import { getGenresList } from '@/entities/genre';
import GenresPage from '@/pages/GenresPage';
import { notFound } from 'next/navigation';

export default async function GenresPageRoute() {
  const genresList = await getGenresList();

  if (!genresList) {
    notFound();
  }

  return <GenresPage genresList={genresList}/>;
}
