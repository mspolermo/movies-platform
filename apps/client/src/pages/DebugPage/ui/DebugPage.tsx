'use client';

import { useAuthStore } from '@/features/auth/api/authStore/store';
import { Layout } from '@/widgets/Layout';

export const DebugPage = () => {
  const { user, token, isAuthenticated, isLoading, error } = useAuthStore();

  return (
    <Layout title='🔍 Debug: Auth State'>
      <div style={{fontFamily: 'monospace' }}>

        <div style={{ marginBottom: '1rem' }}>
          <h2 style={{ color: 'var(--color-heading)' }}>
            Состояние аутентификации:
          </h2>
          <pre
            style={{
              background: 'var(--color-input-background)',
              color: 'var(--color-input-text-dark)',
              padding: '1rem',
              borderRadius: '4px',
            }}
          >
            {JSON.stringify(
              {
                isAuthenticated,
                isLoading,
                hasUser: !!user,
                hasToken: !!token,
                error,
              },
              null,
              2
            )}
          </pre>
        </div>

        {user && (
          <div style={{ marginBottom: '1rem' }}>
            <h2 style={{ color: 'var(--color-heading)' }}>
              Данные пользователя:
            </h2>
            <pre
              style={{
                background: 'var(--color-input-background)',
                color: 'var(--color-input-text-dark)',
                padding: '1rem',
                borderRadius: '4px',
              }}
            >
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        )}

        {token && (
          <div style={{ marginBottom: '1rem' }}>
            <h2 style={{ color: 'var(--color-heading)' }}>
              Токен (первые 50 символов):
            </h2>
            <pre
              style={{
                background: 'var(--color-input-background)',
                color: 'var(--color-input-text-dark)',
                padding: '1rem',
                borderRadius: '4px',
              }}
            >
              {token.substring(0, 50)}...
            </pre>
          </div>
        )}

        <div style={{ marginBottom: '1rem' }}>
          <h2 style={{ color: 'var(--color-heading)' }}>localStorage:</h2>
          <pre
            style={{
              background: 'var(--color-input-background)',
              color: 'var(--color-input-text-dark)',
              padding: '1rem',
              borderRadius: '4px',
            }}
          >
            {JSON.stringify(
              {
                'auth-storage':
                  typeof window !== 'undefined'
                    ? localStorage.getItem('auth-storage')
                    : 'SSR - localStorage недоступен',
              },
              null,
              2
            )}
          </pre>
        </div>

        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '0.5rem 1rem',
            background: 'var(--color-red)',
            color: 'var(--color-heading)',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Обновить страницу
        </button>
      </div>
    </Layout>
  );
};
