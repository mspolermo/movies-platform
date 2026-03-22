'use client';

import { useSearchParams } from 'next/navigation';

import { AllCreatorsViewer } from '@/widgets/AllCreatorsViewer';
import { Page } from '@/widgets/Layout';

export const ProfessionsPage = () => {
  const searchParams = useSearchParams();

  return (
    <Page title="Профессии">
      <AllCreatorsViewer searchParams={searchParams} />
    </Page>
  );
};
