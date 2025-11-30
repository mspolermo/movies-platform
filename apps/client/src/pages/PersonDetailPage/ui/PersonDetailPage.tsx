'use client';

import { useParams } from 'next/navigation';
import { Layout } from '@/widgets/Layout';
import { PersonDetail } from '@/features/getPersonWithProffesionsFilmography';

export const PersonDetailPage = () => {
  const params = useParams();
  const personId = Number(params?.id);

  return (
    <Layout withBackButton>
      <PersonDetail personId={personId}/>
    </Layout>
  );
};
