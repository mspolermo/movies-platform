import type { TAuthorizedUserResponse } from '@common/types';

/**
 * UX-проверка: пользователь с ролью ADMIN (ADR-005).
 * Не является защитой — RBAC на gateway позже.
 */
export const hasAdminRole = (
  user: Pick<TAuthorizedUserResponse, 'roles'> | null | undefined
): boolean => {
  if (!user?.roles?.length) {
    return false;
  }

  return user.roles.some((role) => role.value === 'ADMIN');
};
