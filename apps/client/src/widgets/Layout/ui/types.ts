import type { TQuickFiltersResponse } from '@common/types';

import type { ReactNode } from 'react';

/** Корневая оболочка (app/layout): хедер/футер + SSR quick filters. */
export type TLayoutProps = {
  children: ReactNode;
  initialQuickFilters: TQuickFiltersResponse;
};

/** Контент страницы внутри main: заголовок, назад, дети. */
export type TPageProps = {
  children: ReactNode;
  title?: string;
  withBackButton?: boolean;
};
