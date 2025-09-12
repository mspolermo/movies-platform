import { ReactNode } from 'react';
import { InfiniteScroll, Loader } from '@/shared/ui';
import { useFilmsInfiniteScroll } from './useFilmsInfiniteScroll';
import { SearchFilmsParams } from '@/shared/api/services';
import { TFilmBased } from '@common/types';

interface FilmsInfiniteScrollProps {
  children: (films: TFilmBased[], loading: boolean, error: string | null) => ReactNode;
  initialParams?: SearchFilmsParams;
  threshold?: number;
  loadingComponent?: ReactNode;
  endMessage?: ReactNode;
  className?: string;
}

export const FilmsInfiniteScroll = ({
  children,
  initialParams = {},
  threshold = 200,
  loadingComponent,
  endMessage,
  className,
}: FilmsInfiniteScrollProps) => {
  const { films, loading, error, hasMore, loadMore } = useFilmsInfiniteScroll({
    initialParams,
    threshold,
  });

  const defaultLoadingComponent = (
    <Loader size='small'/>
  );

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
