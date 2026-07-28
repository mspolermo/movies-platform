import type { TBreadcrumbItem } from '@/shared/ui';

const ADMIN_ROOT: TBreadcrumbItem = { label: 'Администрирование', href: '/admin' };

/** Крошки админки без «Главная» (ADR-005). */
export const buildAdminBreadcrumbs = (...tail: TBreadcrumbItem[]): TBreadcrumbItem[] => {
  if (tail.length === 0) {
    return [{ label: 'Администрирование' }];
  }

  return [ADMIN_ROOT, ...tail];
};
