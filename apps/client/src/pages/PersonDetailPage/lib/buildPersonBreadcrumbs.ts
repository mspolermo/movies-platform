import type { TBreadcrumbItem } from '@/shared/ui';
import type { TPersonProfileResponse } from '@common/types';

/** Trail страницы персоны: Главная → Персоны → имя. */
export const buildPersonBreadcrumbs = (
  person?: TPersonProfileResponse | null
): TBreadcrumbItem[] => {
  const home: TBreadcrumbItem = { label: 'Главная', href: '/' };
  const name = person?.nameRu || person?.nameEn;

  if (!name) {
    return [home, { label: 'Персоны' }];
  }

  return [home, { label: 'Персоны', href: '/persons' }, { label: name }];
};
