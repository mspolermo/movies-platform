import { ReactNode } from 'react';
import styles from './LoadMoreSection.module.scss';
import { Loader } from '@/shared/ui';

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
  threshold = 200, // сохраняем проп для обратной совместимости
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

      {!hasMore && !isLoading && (endMessage)}
    </div>
  );
};
