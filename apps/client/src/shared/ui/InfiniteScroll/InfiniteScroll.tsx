import { useEffect, useRef, ReactNode } from 'react';
import styles from './InfiniteScroll.module.scss';

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
  threshold = 200,
  loadingComponent,
  endMessage,
  className,
}: InfiniteScrollProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (isLoading || !hasMore) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= documentHeight - threshold) {
        onLoadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading, hasMore, onLoadMore, threshold]);

  const defaultLoadingComponent = (
    <div className={styles.loading}>
      Загрузка...
    </div>
  );

  const defaultEndMessage = (
    <div className={styles.endMessage}>
      Все данные загружены
    </div>
  );

  return (
    <div ref={containerRef} className={className}>
      {children}
      
      {isLoading && (loadingComponent || defaultLoadingComponent)}
      
      {!hasMore && !isLoading && (endMessage || defaultEndMessage)}
    </div>
  );
};
