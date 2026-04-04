import type { TFilmFiltersProps } from '../../model';

import { FiltersFields } from './FiltersFields';
import styles from './styles/TabletFilters.module.scss';
import { ResetFiltersButton } from './ui';
import { FiltersDropdownProvider } from '../../model';

export const TabletFilters = ({
  allFilters,
  selectedFilters,
  onUpdateFilters,
}: TFilmFiltersProps) => {
  return (
    <FiltersDropdownProvider>
      <div className={styles.content}>
        <div className={styles.blocks}>
          <FiltersFields
            allFilters={allFilters}
            selectedFilters={selectedFilters}
            onUpdateFilters={onUpdateFilters}
          />
        </div>

        <div className={styles.button}>
          <ResetFiltersButton selectedFilters={selectedFilters} onChange={onUpdateFilters} />
        </div>
      </div>
    </FiltersDropdownProvider>
  );
};
