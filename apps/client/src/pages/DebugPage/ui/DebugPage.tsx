'use client';

import { useAuthStore } from '@/features/auth/store';
import { Layout } from '@/widgets/Layout';

export const DebugPage = () => {
  const { user, token, isAuthenticated, isLoading, error } = useAuthStore();

  return (
    <Layout>
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1>🔍 Debug: Auth State</h1>
      
      <div style={{ marginBottom: '1rem' }}>
        <h2>Состояние аутентификации:</h2>
        <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px' }}>
          {JSON.stringify({
            isAuthenticated,
            isLoading,
            hasUser: !!user,
            hasToken: !!token,
            error,
          }, null, 2)}
        </pre>
      </div>

      {user && (
        <div style={{ marginBottom: '1rem' }}>
          <h2>Данные пользователя:</h2>
          <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px' }}>
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      )}

      {token && (
        <div style={{ marginBottom: '1rem' }}>
          <h2>Токен (первые 50 символов):</h2>
          <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px' }}>
            {token.substring(0, 50)}...
          </pre>
        </div>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <h2>localStorage:</h2>
        <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px' }}>
          {JSON.stringify({
            'auth-storage': typeof window !== 'undefined' ? localStorage.getItem('auth-storage') : 'SSR - localStorage недоступен',
          }, null, 2)}
        </pre>
      </div>

      <button 
        onClick={() => window.location.reload()}
        style={{ 
          padding: '0.5rem 1rem', 
          background: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Обновить страницу
      </button>
    </div>
    </Layout>
  );

}
