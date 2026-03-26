import type { TPageProps } from '@/shared/types';

import { isAxiosError } from 'axios';
import { notFound } from 'next/navigation';

import { getPersonProfile } from '@/entities/person';
import { PersonDetailPage } from '@/pages/PersonDetailPage';

export default async function PersonPage({ params: { id } }: TPageProps<{ id: string }>) {
  const personId = Number(id);

  if (!id || Number.isNaN(personId)) {
    notFound();
  }

  try {
    const person = await getPersonProfile(personId);
    return <PersonDetailPage person={person} />;
  } catch (err) {
    if (isAxiosError(err) && err.response?.status === 404) {
      notFound();
    }
    throw err;
  }
}
