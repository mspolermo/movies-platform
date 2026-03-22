'use client';

import { useEffect } from 'react';

import { useAuthStore } from '../api';

/**
 * Компонент для инициализации авторизации при загрузке приложения
 * Проверяет наличие токена в localStorage и валидирует его
 */
export const AuthInitializer = () => {
  const { checkAuth, token, user, isLoading } = useAuthStore();

  useEffect(() => {
    // Проверяем авторизацию при монтировании компонента
    if (token && !user && !isLoading) {
      console.info(
        'AuthInitializer: Token found but no user data, checking auth...'
      );
      checkAuth();
    }
  }, [checkAuth, token, user, isLoading]);

  // Компонент не рендерит ничего видимого
  return null;
};
