import type { LoadMoreSectionProps } from './type';

import { Button, Loader } from '@/shared/ui';

import styles from './LoadMoreSection.module.scss';

/**
 * Обёртка для бесконечной/постраничной подгрузки: контент, индикатор загрузки
 * и кнопка «Показать ещё», пока `hasMore === true` и не идёт загрузка.
 */
export const LoadMoreSection = ({
  children,
  onLoadMore,
  isLoading,
  hasMore,
  loadingComponent,
  endMessage,
  className,
}: LoadMoreSectionProps) => {
  const defaultLoadingComponent = (
    <div aria-busy="true" aria-live="polite" className={styles.loading} role="status">
      <Loader />
    </div>
  );

  return (
    <div className={className}>
      {children}

      {isLoading && (loadingComponent || defaultLoadingComponent)}

      {!isLoading && hasMore && (
        <div className={styles.controls}>
          <Button type="button" variant="outline" onClick={onLoadMore}>
            Показать ещё
          </Button>
        </div>
      )}

      {!hasMore && !isLoading && endMessage}
    </div>
  );
};
