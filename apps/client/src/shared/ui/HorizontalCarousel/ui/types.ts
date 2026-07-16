import type { TScrollStep } from '../lib';

import type { ReactNode } from 'react';

export type THorizontalCarouselProps = {
  children: ReactNode;
  className?: string;
  trackClassName?: string;
  scrollStep?: TScrollStep;
  snapType?: 'none' | 'mandatory';
  arrows?: 'auto' | 'always' | 'never';
};

export type THorizontalCarouselHandle = {
  scrollToIndex: (index: number) => void;
};
