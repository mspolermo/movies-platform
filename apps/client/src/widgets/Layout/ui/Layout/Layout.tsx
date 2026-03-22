'use client';

import type { TLayoutProps } from '../types';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAuthStore } from '@/features/auth';
import { BackButton } from '@/features/navigateBack';
import { Loader } from '@/shared/ui';

import { useQuickFiltersData } from '../../lib';
import { Footer } from '../Footer';
import { Header } from '../Header';
import styles from './Layout.module.scss';

export const Layout = ({ children, withBackButton, title }: TLayoutProps) => {
  const router = useRouter();

  const { isAuthenticated, checkAuth, user, token, isLoading, isInitialized } =
    useAuthStore();

  const { isLoading: isQuickFiltersLoading } = useQuickFiltersData();

  useEffect(() => {
    // Проверяем авторизацию только если есть токен, но нет пользователя
    if (token && !user) {
      checkAuth();
    }
  }, [checkAuth, token, user]);

  useEffect(() => {
    // Перенаправляем на логин только если инициализация завершена и нет токена
    if (isInitialized && !token && !isLoading) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, token, router, isLoading, isInitialized, user]);

  // Показываем контент только если авторизован и есть пользователь
  if (!isAuthenticated || !user || !token) {
    return null;
  }

  // Показываем загрузку если еще не инициализирован или идет загрузка
  if (
    !isInitialized ||
    isQuickFiltersLoading ||
    (token && !user && isLoading)
  ) {
    return (
      <main className={styles.loadingLayout}>
        <Loader />
      </main>
    );
  }

  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.body}>
        <div className={styles.main}>
          {withBackButton && <BackButton />}
          {title && <h1 className={styles.title}>{title}</h1>}
          {children}
        </div>
        <Footer />
      </main>
    </div>
  );
};
