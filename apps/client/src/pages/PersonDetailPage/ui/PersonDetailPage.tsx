'use client';

import { useParams } from 'next/navigation';

import { PersonDetail } from '@/features/getPersonWithProffesionsFilmography';
import { Page } from '@/widgets/Layout';

export const PersonDetailPage = () => {
  const params = useParams();
  const personId = Number(params?.id);

  return (
    <Page withBackButton>
      <PersonDetail personId={personId} />
    </Page>
  );
};
