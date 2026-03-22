'use client';

import { Page } from '@/widgets/Layout';

export const DebugPage = () => {
  return (
    <Page title="🔍 Debug">
      <div style={{ fontFamily: 'monospace' }}>
        <div style={{ marginBottom: '1rem' }}>
          <h2 style={{ color: 'var(--color-heading)' }}>
            Клиент без авторизации
          </h2>
          <p style={{ color: 'var(--color-text)' }}>
            Состояние входа и токенов на клиенте не хранится (zustand удалён).
          </p>
        </div>

        <button
          style={{
            padding: '0.5rem 1rem',
            background: 'var(--color-red)',
            color: 'var(--color-heading)',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
          type="button"
          onClick={() => window.location.reload()}
        >
          Обновить страницу
        </button>
      </div>
    </Page>
  );
};
