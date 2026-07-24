'use client';

import type { TPersonDetailPageProps } from './types';

import { Page } from '@/widgets/Layout';
import { PersonDetail } from '@/widgets/PersonDetail';

import { buildPersonBreadcrumbs } from '../lib';

/** Страница персоны: обёртка `Page` с крошками и виджет детальной информации */
export const PersonDetailPage = ({ isLoading, person }: TPersonDetailPageProps) => (
  <Page breadcrumbs={buildPersonBreadcrumbs(person)}>
    <PersonDetail isLoading={Boolean(isLoading)} person={person} />
  </Page>
);
