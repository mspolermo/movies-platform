'use client';

import { useSearchParams } from 'next/navigation';
import { Layout } from '@/widgets/Layout';
import { AllCreatorsViewer } from '@/widgets/AllCreatorsViewer';

export const ProfessionsPage = () => {
  const searchParams = useSearchParams();

  return (
    <Layout title='Профессии'>
      <AllCreatorsViewer searchParams={searchParams} />
    </Layout>
  );
};
