import type { TAdminUserItemResponse, TAppRole, TUpdateUserRoleRequest } from '@common/types';

import { API_ENDPOINTS } from '@/shared/api';
import { debugStubLog } from '@/shared/lib';

const roleMeta = (role: TAppRole, id: number) => ({
  id,
  value: role,
  description: role,
});

/** Начальные данные пользователей в памяти (не БД auth-users). */
const INITIAL: TAdminUserItemResponse[] = [
  {
    id: 1,
    email: 'admin@gmail.com',
    name: 'Admin',
    role: 'ADMIN',
    roles: [roleMeta('ADMIN', 1)],
  },
  {
    id: 2,
    email: 'user@example.com',
    name: 'User',
    role: 'USER',
    roles: [roleMeta('USER', 2)],
  },
  {
    id: 3,
    email: 'manager@example.com',
    name: 'Manager',
    role: 'MANAGER',
    roles: [roleMeta('MANAGER', 3)],
  },
];

let items = INITIAL.map((u) => ({ ...u, roles: [...u.roles] }));
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

/** Сброс хранилища-заглушки (тесты). */
export const resetUsersStub = () => {
  items = INITIAL.map((u) => ({ ...u, roles: u.roles.map((r) => ({ ...r })) }));
  emit();
};

/** Подписка на список пользователей (заглушка). */
export const subscribeUsers = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};

/** Снимок списка пользователей. */
export const getUsersSnapshot = () => items;

/** Заглушка GET `/admin/users`. */
export const listUsersStub = async (): Promise<TAdminUserItemResponse[]> => {
  debugStubLog('[manageUsers] LIST', { path: API_ENDPOINTS.ADMIN.USERS.LIST });
  return items;
};

/** Заглушка PATCH `/admin/users/:id` — смена роли. Защита последнего ADMIN — только на бэкенде (ADR-005). */
export const updateUserRoleStub = async (
  id: number,
  payload: TUpdateUserRoleRequest
): Promise<TAdminUserItemResponse | null> => {
  debugStubLog('[manageUsers] UPDATE ROLE', {
    path: API_ENDPOINTS.ADMIN.USERS.BY_ID(id),
    payload,
  });
  const i = items.findIndex((x) => x.id === id);
  if (i < 0) return null;
  const roleId = payload.role === 'ADMIN' ? 1 : payload.role === 'USER' ? 2 : 3;
  const updated: TAdminUserItemResponse = {
    ...items[i],
    role: payload.role,
    roles: [roleMeta(payload.role, roleId)],
  };
  items = items.map((x, idx) => (idx === i ? updated : x));
  emit();
  return updated;
};
