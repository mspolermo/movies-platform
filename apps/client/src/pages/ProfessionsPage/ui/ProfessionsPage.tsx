'use client';

import type { TProfessionsPageProps } from './types';

import { useSearchParams } from 'next/navigation';

import { AllCreatorsViewer } from '@/widgets/AllCreatorsViewer';
import { Page } from '@/widgets/Layout';

import { buildProfessionsBreadcrumbs, resolveActiveProfessionName } from '../lib';

export const ProfessionsPage = (props: TProfessionsPageProps) => {
  const searchParams = useSearchParams();
  const professionQuery = searchParams?.get('profession') ?? null;
  const professionName = resolveActiveProfessionName({
    ...props,
    queryName: professionQuery,
  });

  return (
    <Page breadcrumbs={buildProfessionsBreadcrumbs(professionName)} title="Профессии">
      <AllCreatorsViewer {...props} />
    </Page>
  );
};
