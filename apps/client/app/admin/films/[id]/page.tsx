import type { TPageProps } from '@/shared/types';

import { AdminFilmFormPage } from '@/pages/AdminFilmFormPage';

export default async function AdminFilmEditRoute({ params }: TPageProps<{ id: string }>) {
  const { id } = await params;
  return <AdminFilmFormPage filmId={Number(id)} mode="edit" />;
}
