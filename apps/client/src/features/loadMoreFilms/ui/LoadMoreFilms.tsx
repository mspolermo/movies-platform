import { useEffect } from 'react';
import { LoadMoreSection, Loader } from '@/shared/ui';

import { useLoadMoreFilms } from '../lib';
import { LoadMoreFilmsProps } from './types';

export const LoadMoreFilms = ({
  children,
  initialParams = {},
  threshold = 200,
  loadingComponent,
  endMessage,
  onParamsChange,
}: LoadMoreFilmsProps) => {
  const { films, loading, error, hasMore, loadMore, updateParams } = useLoadMoreFilms({
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
    <LoadMoreSection
      onLoadMore={loadMore}
      isLoading={loading}
      hasMore={hasMore}
      threshold={threshold}
      loadingComponent={loadingComponent || defaultLoadingComponent}
      endMessage={endMessage || defaultEndMessage}
    >
      {children(films, loading, error)}
    </LoadMoreSection>
  );
};
