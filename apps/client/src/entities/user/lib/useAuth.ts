import { useUserStore } from '../model';

/**
 * Состояние сессии из zustand: user, status и удобные флаги для UI.
 * Не делает запросов — bootstrap выполняется в AuthProvider.
 */
export const useAuth = () => {
  const user = useUserStore((state) => state.user);
  const status = useUserStore((state) => state.status);

  return {
    user,
    status,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading' || status === 'idle',
  };
};
