import type { ReactNode } from 'react';

export type TLoadMoreSectionProps = {
  children: ReactNode;
  onLoadMore: () => void;
  isLoading: boolean;
  hasMore: boolean;
  loadingComponent?: ReactNode;
  className?: string;
};
