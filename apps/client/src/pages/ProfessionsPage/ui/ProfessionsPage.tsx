'use client';

import type { TProfessionsPageProps } from './types';

import { AllCreatorsViewer } from '@/widgets/AllCreatorsViewer';
import { Page } from '@/widgets/Layout';

export const ProfessionsPage = (props: TProfessionsPageProps) => {
  return (
    <Page title="Профессии">
      <AllCreatorsViewer {...props} />
    </Page>
  );
};
