'use client';

import { useAuthStore } from '@/features/auth/api/authStore/store';
import { Layout } from '@/widgets/Layout';
import { colors } from '@/styles/index';

export const DebugPage = () => {
  const { user, token, isAuthenticated, isLoading, error } = useAuthStore();

  return (
    <Layout>
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1 style={{ color: colors.headingColor }}>🔍 Debug: Auth State</h1>
      
      <div style={{ marginBottom: '1rem' }}>
        <h2 style={{ color: colors.headingColor }}>Состояние аутентификации:</h2>
        <pre style={{ background: colors.inputBackground, color: colors.inputTextDark, padding: '1rem', borderRadius: '4px' }}>
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
          <h2 style={{ color: colors.headingColor }}>Данные пользователя:</h2>
          <pre style={{ background: colors.inputBackground, color: colors.inputTextDark, padding: '1rem', borderRadius: '4px' }}>
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      )}

      {token && (
        <div style={{ marginBottom: '1rem' }}>
          <h2 style={{ color: colors.headingColor }}>Токен (первые 50 символов):</h2>
          <pre style={{ background: colors.inputBackground, color: colors.inputTextDark, padding: '1rem', borderRadius: '4px' }}>
            {token.substring(0, 50)}...
          </pre>
        </div>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <h2 style={{ color: colors.headingColor }}>localStorage:</h2>
        <pre style={{ background: colors.inputBackground, color: colors.inputTextDark, padding: '1rem', borderRadius: '4px' }}>
          {JSON.stringify({
            'auth-storage': typeof window !== 'undefined' ? localStorage.getItem('auth-storage') : 'SSR - localStorage недоступен',
          }, null, 2)}
        </pre>
      </div>

      <button 
        onClick={() => window.location.reload()}
        style={{ 
          padding: '0.5rem 1rem', 
          background: colors.redColor, 
          color: colors.headingColor, 
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
