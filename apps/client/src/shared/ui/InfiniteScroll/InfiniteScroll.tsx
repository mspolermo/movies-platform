import { ReactNode } from 'react';
import styles from './InfiniteScroll.module.scss';
import { Loader } from '@/shared/ui';

export interface InfiniteScrollProps {
  children: ReactNode;
  onLoadMore: () => void;
  isLoading: boolean;
  hasMore: boolean;
  threshold?: number;
  loadingComponent?: ReactNode;
  endMessage?: ReactNode;
  className?: string;
}

export const InfiniteScroll = ({
  children,
  onLoadMore,
  isLoading,
  hasMore,
  threshold = 200, // сохраняем проп для обратной совместимости
  loadingComponent,
  endMessage,
  className,
}: InfiniteScrollProps) => {

  const defaultLoadingComponent = (
    <div className={styles.loading}>
      <Loader />
    </div>
  );

  const defaultEndMessage = (
    <div className={styles.endMessage}>
      Все данные загружены
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

      {!hasMore && !isLoading && (endMessage || defaultEndMessage)}
    </div>
  );
};
