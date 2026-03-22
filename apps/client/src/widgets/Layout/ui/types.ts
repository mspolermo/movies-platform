import type { ReactNode } from 'react';

export type TLayoutProps = {
  title?: string;
  withBackButton?: boolean;
  children: ReactNode;
};
