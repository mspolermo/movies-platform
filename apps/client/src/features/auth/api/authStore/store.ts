import type { LoginRequest, LoginResponse } from '@/shared/types';
import type { TUserBased } from '@common/types';

import { isAxiosError } from 'axios';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

interface AuthState {
  user: TUserBased | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean; // Флаг инициализации
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Состояние
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,
      error: null,

      // Действия
      login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null });
        try {
          console.info('Auth store: Attempting login with:', credentials);

          const response = await apiClient.post<LoginResponse>(
            API_ENDPOINTS.AUTH.LOGIN,
            credentials
          );

          console.info('Auth store: Login response:', response.data);

          const { token, email, userId, role } = response.data;

          // Создаем объект пользователя из ответа API
          const user: TUserBased = {
            id: userId,
            email,
            roles: role,
          };

          console.info('Auth store: Created user object:', user);
          console.info('Auth store: Token:', token.token);

          const newState = {
            user,
            token: token.token, // Извлекаем токен из вложенного объекта
            isAuthenticated: true,
            isLoading: false,
            isInitialized: true,
            error: null,
          };

          console.info('Auth store: Setting new state:', newState);
          set(newState);

          // Проверяем, что состояние действительно обновилось
          setTimeout(() => {
            const currentState = get();
            console.info(
              'Auth store: Current state after update:',
              currentState
            );
          }, 100);
        } catch (error: unknown) {
          console.error('Auth store: Login error:', error);
          const loginError =
            isAxiosError(error) &&
            error.response?.data &&
            typeof error.response.data === 'object' &&
            error.response.data !== null &&
            'message' in error.response.data &&
            typeof (error.response.data as { message: unknown }).message ===
              'string'
              ? (error.response.data as { message: string }).message
              : 'Ошибка входа';
          set({
            isLoading: false,
            error: loginError,
          });
          throw error;
        }
      },

      logout: () => {
        console.info('Auth store: Logging out');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          isInitialized: true,
          error: null,
        });
      },

      checkAuth: async () => {
        const { token } = get();
        console.info('Auth store: checkAuth called, token exists:', !!token);

        if (!token) {
          console.info('Auth store: No token, skipping checkAuth');
          return;
        }

        set({ isLoading: true, error: null });

        try {
          console.info('Auth store: Checking token validity...');
          const response = await apiClient.get(API_ENDPOINTS.AUTH.CHECK_TOKEN);
          const user = response.data;

          console.info('Auth store: Token is valid, user data:', user);

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            isInitialized: true,
            error: null,
          });
        } catch (error: unknown) {
          console.error('Auth store: Token check failed:', error);

          if (isAxiosError(error) && error.response?.status === 401) {
            console.info('Auth store: Token invalid, logging out');
            get().logout();
          } else {
            set({
              isLoading: false,
              isInitialized: true,
              error: 'Ошибка проверки авторизации',
            });
          }
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isInitialized: state.isInitialized,
      }),
      onRehydrateStorage: () => (state) => {
        console.info('Auth store: Rehydrated state:', state);

        // Если нет токена, помечаем как инициализированный
        if (!state || !state.token) {
          console.info(
            'Auth store: No token found after rehydration, marking as initialized'
          );
          if (state) {
            state.isInitialized = true;
          }
          return;
        }

        console.info(
          'Auth store: Token found after rehydration, checking auth...'
        );
        // Увеличиваем задержку для корректной инициализации
        setTimeout(() => {
          console.info('Auth store: Calling checkAuth after rehydration delay');
          state.checkAuth();
        }, 500);
      },
    }
  )
);
