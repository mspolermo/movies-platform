import type { LoadMoreFilmsProps } from './types';

import { FilmCardsList } from '@/entities/film';
import { LoadMoreSection } from '@/shared/ui';

import { useLoadMoreFilms } from '../lib';

/**
 * Список фильмов с кнопкой «Показать ещё»: `initialParams` синхронизируется с хуком
 * и при изменении сбрасывает выдачу и перезапрашивает первую страницу.
 */
export const LoadMoreFilms = ({
  initialParams = {},
  isPageLoading = false,
}: LoadMoreFilmsProps) => {
  const { films, loading, error, hasMore, loadMore } = useLoadMoreFilms({
    initialParams,
    enabled: !isPageLoading,
  });

  const listLoading = isPageLoading || (loading && films.length === 0);

  return (
    <LoadMoreSection
      hasMore={hasMore && !isPageLoading}
      isLoading={loading && films.length > 0}
      loadingComponent={<FilmCardsList films={[]} loading={true} />}
      onLoadMore={loadMore}
    >
      <FilmCardsList error={error} films={films} loading={listLoading} />
    </LoadMoreSection>
  );
};
