import type { ReactNode } from 'react';

export type TExpandableBlockVariant = 'accent' | 'neutral' | 'warning';

export type TExpandableBlockProps = {
  expandLabel: string;
  collapseLabel: string;
  children: ReactNode;
  variant?: TExpandableBlockVariant;
};
