'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/api/authStore/store';
import { Header } from '../Header';
import { Footer } from '../Footer';
import styles from './Layout.module.scss';
import { Loader } from '@/shared/ui';
import { BackButton } from '@/features/navigateBack';

interface TLayoutProps {
  withBackButton?: boolean;
  children: ReactNode;
}

export const Layout = ({ children, withBackButton }: TLayoutProps) => {
  const router = useRouter();

  const { isAuthenticated, checkAuth, user, token, isLoading, isInitialized } =
    useAuthStore();

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
  if (!isInitialized || (token && !user && isLoading)) {
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
            {children}
          </div>
          <Footer />
      </main>
    </div>
  );
};
