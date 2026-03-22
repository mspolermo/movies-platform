import type { ReactNode } from 'react';

import { Loader } from '@/shared/ui';

import styles from './LoadMoreSection.module.scss';

export interface LoadMoreSectionProps {
  children: ReactNode;
  onLoadMore: () => void;
  isLoading: boolean;
  hasMore: boolean;
  threshold?: number;
  loadingComponent?: ReactNode;
  endMessage?: ReactNode;
  className?: string;
}

export const LoadMoreSection = ({
  children,
  onLoadMore,
  isLoading,
  hasMore,
  threshold: _threshold = 200, // сохраняем проп для обратной совместимости (IntersectionObserver позже)
  loadingComponent,
  endMessage,
  className,
}: LoadMoreSectionProps) => {
  const defaultLoadingComponent = (
    <div className={styles.loading}>
      <Loader />
    </div>
  );

  return (
    <div className={className}>
      {children}

      {isLoading && (loadingComponent || defaultLoadingComponent)}

      {!isLoading && hasMore && (
        <div className={styles.controls}>
          <button className={styles.loadMoreButton} onClick={onLoadMore}>
            Показать ещё
          </button>
        </div>
      )}

      {!hasMore && !isLoading && endMessage}
    </div>
  );
};
