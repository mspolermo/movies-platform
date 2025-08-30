'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/store';

export const HomePage = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/films');
    } else {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  return null;
}
