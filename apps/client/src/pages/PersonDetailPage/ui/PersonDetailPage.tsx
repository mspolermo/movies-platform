'use client';

import type { TPersonDetailPageProps } from './types';

import { Page } from '@/widgets/Layout';
import { PersonDetail } from '@/widgets/PersonDetail';

/** Страница персоны: обёртка `Page` с «назад» и виджет детальной информации о
 * персоне с проффессиями и фильмами */
export const PersonDetailPage = ({ isLoading, person }: TPersonDetailPageProps) => (
  <Page withBackButton>
    <PersonDetail isLoading={Boolean(isLoading)} person={person} />
  </Page>
);
