'use client';

import { useParams } from 'next/navigation';

import { PersonDetail } from '@/features/getPersonWithProffesionsFilmography';
import { Layout } from '@/widgets/Layout';

export const PersonDetailPage = () => {
  const params = useParams();
  const personId = Number(params?.id);

  return (
    <Layout withBackButton>
      <PersonDetail personId={personId} />
    </Layout>
  );
};
