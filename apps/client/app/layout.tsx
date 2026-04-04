import type { TQuickFiltersResponse } from '@common/types';
import type { Metadata } from 'next';

import type { ReactNode } from 'react';

import { Inter } from 'next/font/google';

import '@/app/styles/globals.scss';

import { DEFAULT_FILTERS_LOCALE } from '@/shared/constants';
import { getQuickFilters, Layout } from '@/widgets/Layout';

const inter = Inter({ subsets: ['latin'] });

const emptyQuickFilters: TQuickFiltersResponse = {
  genres: [],
  countries: [],
  years: [],
};

export const metadata: Metadata = {
  title: 'Movies Platform',
  description: 'Платформа для просмотра информации о фильмах',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  let initialQuickFilters = emptyQuickFilters;

  try {
    initialQuickFilters = await getQuickFilters(DEFAULT_FILTERS_LOCALE);
  } catch (e) {
    console.error('RootLayout: getQuickFilters failed', e);
  }

  return (
    <html lang="ru">
      <body className={inter.className}>
        <Layout initialQuickFilters={initialQuickFilters}>{children}</Layout>
      </body>
    </html>
  );
}
