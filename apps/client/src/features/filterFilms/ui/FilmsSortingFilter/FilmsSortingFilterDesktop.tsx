import type { TFilmsSortingFilterProps } from '../../model';

import { SortFilter } from '@/shared/ui';

import styles from './FilmsSortingFilter.module.scss';
import { Filters } from '../Filters';

export const FilmsSortingFilterDesktop = ({
  allFilters,
  selectedFilters,
  onUpdateFilters,
  selectedSort,
  onUpdateSort,
}: TFilmsSortingFilterProps) => {
  return (
    <div className={styles.desktopWrap}>
      <Filters
        allFilters={allFilters}
        selectedFilters={selectedFilters}
        onUpdateFilters={onUpdateFilters}
      />
      <div className={styles.desktopSort}>
        <SortFilter selectedSort={selectedSort} onUpdateSort={onUpdateSort} />
      </div>
    </div>
  );
};
