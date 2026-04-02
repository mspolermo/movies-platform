import type { LoadMoreFilmsProps } from './types';

import { useEffect } from 'react';

import { FilmCardsList } from '@/entities/film';
import { LoadMoreSection } from '@/shared/ui';

import { useLoadMoreFilms } from '../lib';

/**
 * Список фильмов с кнопкой «Показать ещё»: `initialParams` синхронизируется с хуком
 * и при изменении сбрасывает выдачу и перезапрашивает первую страницу.
 */
export const LoadMoreFilms = ({ initialParams = {} }: LoadMoreFilmsProps) => {
  const { films, loading, error, hasMore, loadMore, updateParams } = useLoadMoreFilms({
    initialParams,
  });

  useEffect(() => {
    updateParams(initialParams);
  }, [initialParams, updateParams]);

  const listLoading = loading && films.length === 0;

  return (
    <LoadMoreSection
      hasMore={hasMore}
      isLoading={loading && films.length > 0}
      loadingComponent={<FilmCardsList films={[]} loading={true} />}
      onLoadMore={loadMore}
    >
      <FilmCardsList error={error} films={films} loading={listLoading} />
    </LoadMoreSection>
  );
};
