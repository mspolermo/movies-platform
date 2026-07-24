'use client';

import type { TLayoutProps } from '../types';

import { AuthProvider } from '@/features/auth';
import { RateFilmProvider } from '@/features/rateFilm';

import { QuickFiltersProvider } from '../../models';
import { Footer } from '../Footer';
import { Header } from '../Header';
import styles from './Layout.module.scss';

/**
 * Каркас: провайдер SSR-данных → хедер + main + футер.
 */
export const Layout = ({ children, initialQuickFilters }: TLayoutProps) => {
  return (
    <AuthProvider>
      <RateFilmProvider>
        <QuickFiltersProvider value={initialQuickFilters}>
          <div className={styles.layout}>
            <Header />
            <main className={styles.body}>
              <div className={styles.main}>{children}</div>
              <Footer />
            </main>
          </div>
        </QuickFiltersProvider>
      </RateFilmProvider>
    </AuthProvider>
  );
};
