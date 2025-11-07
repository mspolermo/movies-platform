import { useEffect } from 'react';
import { InfiniteScroll, Loader } from '@/shared/ui';
import { SearchFilmsParams } from '@/shared/api/services';
import { useFilmsInfiniteScroll } from '../lib';
import { FilmsInfiniteScrollProps } from './types';

export const FilmsInfiniteScroll = ({
  children,
  initialParams = {},
  threshold = 200,
  loadingComponent,
  endMessage,
  className,
  onParamsChange,
}: FilmsInfiniteScrollProps) => {
  const { films, loading, error, hasMore, loadMore, updateParams } = useFilmsInfiniteScroll({
    initialParams,
    threshold,
  });

  useEffect(() => {
    updateParams(initialParams);
    onParamsChange?.(initialParams);
  }, [initialParams, onParamsChange, updateParams]);

  const defaultLoadingComponent = <Loader size="small" />;

  const defaultEndMessage = (
    <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.7 }}>
      Все фильмы загружены
    </div>
  );

  return (
    <InfiniteScroll
      onLoadMore={loadMore}
      isLoading={loading}
      hasMore={hasMore}
      threshold={threshold}
      loadingComponent={loadingComponent || defaultLoadingComponent}
      endMessage={endMessage || defaultEndMessage}
      className={className}
    >
      {children(films, loading, error)}
    </InfiniteScroll>
  );
};
