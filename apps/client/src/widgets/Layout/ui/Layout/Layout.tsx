'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/api/authStore/store';
import { Header } from '../Header';
import styles from './Layout.module.scss';
import { Loader } from '@/shared/ui';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated, checkAuth, user, token, isLoading, isInitialized } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Проверяем авторизацию только если есть токен, но нет пользователя
    if (token && !user) {
      console.log('Layout: Token exists but no user, checking auth...');
      checkAuth();
    }
  }, [checkAuth, token, user]);

  useEffect(() => {
    console.log('Layout: Auth state changed:', { isAuthenticated, user: !!user, token: !!token, isLoading, isInitialized });
    
    // Перенаправляем на логин только если инициализация завершена и нет токена
    if (isInitialized && !token && !isLoading) {
      console.log('Layout: Initialized and no token, redirecting to login');
      router.push('/auth/login');
    }
  }, [isAuthenticated, token, router, isLoading, isInitialized]);

  // Показываем отладочную информацию в development
  if (process.env.NODE_ENV === 'development') {
    console.log('Layout render:', { isAuthenticated, user: !!user, token: !!token, isLoading, isInitialized });
  }

  // Показываем загрузку если еще не инициализирован или идет загрузка
  if (!isInitialized || (token && !user && isLoading)) {
    return <Loader />;
  }

  // Показываем контент только если авторизован и есть пользователь
  if (!isAuthenticated || !user || !token) {
    return null;
  }

  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
};
