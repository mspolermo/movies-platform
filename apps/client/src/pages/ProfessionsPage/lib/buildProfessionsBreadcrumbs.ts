import type { TBreadcrumbItem } from '@/shared/ui';

/** Trail каталога профессий: Главная → Профессии [→ выбранная профессия]. */
export const buildProfessionsBreadcrumbs = (professionName?: string | null): TBreadcrumbItem[] => {
  const home: TBreadcrumbItem = { label: 'Главная', href: '/' };

  if (!professionName) {
    return [home, { label: 'Профессии' }];
  }

  return [home, { label: 'Профессии', href: '/professions' }, { label: professionName }];
};
