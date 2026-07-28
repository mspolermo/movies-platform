import type { TBreadcrumbItem } from '@/shared/ui';
import type { TQuickFiltersResponse } from '@common/types';

import type { ReactNode } from 'react';

/** Корневая оболочка (app/layout): хедер/футер + SSR quick filters. */
export type TLayoutProps = {
  children: ReactNode;
  initialQuickFilters: TQuickFiltersResponse;
};

/** Контент страницы внутри main: заголовок, назад, крошки, дети. */
export type TPageProps = {
  children: ReactNode;
  title?: string;
  /** h1 в DOM для a11y, без визуала. */
  titleVisuallyHidden?: boolean;
  onlyLaptopTitle?: boolean;
  withBackButton?: boolean;
  breadcrumbs?: TBreadcrumbItem[];
  titleAlign?: 'center' | 'start';
};
