'use client';

import type { TPersonDetailPageProps } from './types';

import { Page } from '@/widgets/Layout';
import { PersonDetail } from '@/widgets/PersonDetail';

export const PersonDetailPage = ({ isLoading, person }: TPersonDetailPageProps) => (
  <Page withBackButton>
    <PersonDetail isLoading={Boolean(isLoading)} person={person} />
  </Page>
);
