'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/api/authStore/store';
import { Navbar } from '@/widgets/Navbar';
import styles from './Layout.module.scss';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated, checkAuth, user, token } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    console.log('Layout: Auth state changed:', { isAuthenticated, user: !!user, token: !!token });
    
    if (!isAuthenticated && !token) {
      console.log('Layout: Redirecting to login - not authenticated');
      router.push('/auth/login');
    }
  }, [isAuthenticated, token, router]);

  // Показываем отладочную информацию в development
  if (process.env.NODE_ENV === 'development') {
    console.log('Layout render:', { isAuthenticated, user: !!user, token: !!token });
  }

  if (!isAuthenticated || !token) {
    return null;
  }

  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
};
