import type { TLoadMoreSectionProps } from '../model';

import { Button } from '@/shared/ui/Button';
import { Loader } from '@/shared/ui/Loader';

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
  className,
}: TLoadMoreSectionProps) => {
  const defaultLoadingComponent = (
    <div aria-busy="true" aria-live="polite" className={styles.loading} role="status">
      <Loader />
    </div>
  );

  return (
    <div className={className}>
      {children}

      {isLoading && (loadingComponent !== undefined ? loadingComponent : defaultLoadingComponent)}

      {!isLoading && hasMore && (
        <div className={styles.controls}>
          <Button type="button" variant="outline" onClick={onLoadMore}>
            Показать ещё
          </Button>
        </div>
      )}
    </div>
  );
};
