'use client';

import type { TAppRole } from '@common/types';

import { useRef, useState } from 'react';

import { Select } from '@/shared/ui';

import styles from './AdminUsersPanel.module.scss';
import { updateUserRoleStub } from '../../api';
import { useAdminUsers } from '../../lib';

const ROLE_OPTIONS = [
  { value: 'ADMIN', label: 'ADMIN' },
  { value: 'USER', label: 'USER' },
  { value: 'MANAGER', label: 'MANAGER' },
] as const;

const isAppRole = (value: string): value is TAppRole =>
  value === 'ADMIN' || value === 'USER' || value === 'MANAGER';

/** Таблица пользователей и смена роли (заглушка). */
export const AdminUsersPanel = () => {
  const users = useAdminUsers();
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pendingIdRef = useRef<number | null>(null);

  const handleRoleChange = async (userId: number, role: TAppRole) => {
    pendingIdRef.current = userId;
    setPendingId(userId);
    setError(null);
    try {
      const updated = await updateUserRoleStub(userId, { role });
      if (!updated) {
        setError('Пользователь не найден');
      }
    } catch {
      setError('Не удалось сменить роль');
    } finally {
      if (pendingIdRef.current === userId) {
        pendingIdRef.current = null;
        setPendingId(null);
      }
    }
  };

  return (
    <div className={styles.root}>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      <table className={styles.table}>
        <caption className={styles.caption}>Пользователи (stub)</caption>
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Email</th>
            <th scope="col">Имя</th>
            <th scope="col">Роль</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.name ?? '—'}</td>
              <td>
                <Select
                  aria-label={`Роль ${user.email}`}
                  disabled={pendingId === user.id}
                  options={[...ROLE_OPTIONS]}
                  size="small"
                  value={user.role}
                  onChange={(role) => {
                    if (isAppRole(role)) {
                      void handleRoleChange(user.id, role);
                    }
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className={styles.note}>
        Список stub (не из auth-users). Смена роли только в памяти до F1-BE. Last-ADMIN guard — на
        сервере.
      </p>
    </div>
  );
};
