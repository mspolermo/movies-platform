import { useUserStore } from '../../../model';

/**
 * Сессия из zustand: user, status и флаги для UI.
 * Сеть не дергает — bootstrap в AuthProvider.
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
