'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../api/authStore/store';

/**
 * Компонент для инициализации авторизации при загрузке приложения
 * Проверяет наличие токена в localStorage и валидирует его
 */
export const AuthInitializer = () => {
  const { checkAuth, token, user, isLoading, isInitialized } = useAuthStore();

  useEffect(() => {
    // Проверяем авторизацию при монтировании компонента
    if (token && !user && !isLoading) {
      console.log(
        'AuthInitializer: Token found but no user data, checking auth...'
      );
      checkAuth();
    }
  }, [checkAuth, token, user, isLoading]);

  // Компонент не рендерит ничего видимого
  return null;
};
