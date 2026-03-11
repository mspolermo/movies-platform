'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/api/authStore/store';
import { Header } from '../Header';
import { Footer } from '../Footer';
import styles from './Layout.module.scss';
import { Loader } from '@/shared/ui';
import { BackButton } from '@/features/navigateBack';

interface LayoutProps {
  withBackButton?: boolean;
  children: ReactNode;
}

export const Layout = ({ children, withBackButton }: LayoutProps) => {
  const { isAuthenticated, checkAuth, user, token, isLoading, isInitialized } =
    useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Проверяем авторизацию только если есть токен, но нет пользователя
    if (token && !user) {
      console.log('Layout: Token exists but no user, checking auth...');
      checkAuth();
    }
  }, [checkAuth, token, user]);

  useEffect(() => {
    console.log('Layout: Auth state changed:', {
      isAuthenticated,
      user: !!user,
      token: !!token,
      isLoading,
      isInitialized,
    });

    // Перенаправляем на логин только если инициализация завершена и нет токена
    if (isInitialized && !token && !isLoading) {
      console.log('Layout: Initialized and no token, redirecting to login');
      router.push('/auth/login');
    }
  }, [isAuthenticated, token, router, isLoading, isInitialized, user]);

  // Показываем отладочную информацию в development
  if (process.env.NODE_ENV === 'development') {
    console.log('Layout render:', {
      isAuthenticated,
      user: !!user,
      token: !!token,
      isLoading,
      isInitialized,
    });
  }

  // Показываем загрузку если еще не инициализирован или идет загрузка
  if (!isInitialized || (token && !user && isLoading)) {
    return (
      <div className={styles.loadingLayout}>
        <Loader />
      </div>
    );
  }

  // Показываем контент только если авторизован и есть пользователь
  if (!isAuthenticated || !user || !token) {
    return null;
  }

  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.headerSpacer} aria-hidden />
      <div className={styles.body}>
        <main className={styles.main}>
            {withBackButton && <BackButton />}
            {children}
          </main>
        <Footer />
      </div>
    </div>
  );
};
