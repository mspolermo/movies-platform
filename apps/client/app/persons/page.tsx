import { notFound } from 'next/navigation';

import { getAllPersonsPaginated } from '@/entities/person';
import { PersonsPage } from '@/pages/PersonsPage';

export default async function PersonsPageRoute() {
  const initialPersonsPage = await getAllPersonsPaginated({ page: 1, limit: 20 });

  if (!initialPersonsPage) {
    notFound();
  }

  return <PersonsPage initialPersonsPage={initialPersonsPage} />;
}
