'use client';

import { useSearchParams } from 'next/navigation';

import { AllCreatorsViewer } from '@/widgets/AllCreatorsViewer';
import { Layout } from '@/widgets/Layout';

export const ProfessionsPage = () => {
  const searchParams = useSearchParams();

  return (
    <Layout title="Профессии">
      <AllCreatorsViewer searchParams={searchParams} />
    </Layout>
  );
};
