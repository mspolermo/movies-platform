import type { TPersonSearchingProps } from '../../../../model';

import { useMemo } from 'react';

import { Input } from '@/shared/ui';

import styles from './PersonSearching.module.scss';
import { usePersonFilterField, usePersonSearchQuery } from '../../../../lib';
import { FilterDropdown } from '../../../FilterDropdown';

//TODO: поиск не по id профессии должен быть, но для этого нужно сделать посев в базу
// с англ названиями профессий и переработать сервер

/**
 * Фильтр фильмов по актёру или режиссёру: поиск персон по имени, выбор из списка, очистка через `Input`.
 * В поле показывается зафиксированное значение; при правках сбрасывается фильтр до нового выбора.
 * При закрытии дропдауна черновик ввода отбрасывается и подставляется актуальный `selectedValue`.
 *
 * @template T — поле фильтра: `actor` или `producer`.
 */
export const PersonSearching = <T extends 'actor' | 'producer'>({
  type,
  selectedValue,
  onChange,
}: TPersonSearchingProps<T>) => {
  const professionId = type === 'producer' ? 2 : 1;

  const { name, handleChange, handleClearFilter, handleSelectPerson } = usePersonFilterField({
    type,
    selectedValue,
    onChange,
  });

  const { results } = usePersonSearchQuery({
    professionId,
    name,
  });

  const resultsToShow = useMemo(() => {
    if (!selectedValue) {
      return results;
    }
    return results.filter((person) => person.nameRu !== selectedValue);
  }, [results, selectedValue]);

  return (
    <FilterDropdown
      blockName={type}
      filterName={type === 'producer' ? 'Режиссер' : 'Актер'}
      selectedFiltersBy={selectedValue}
    >
      <div className={styles.root}>
        <Input
          clearable
          placeholder="Введите имя…"
          type="text"
          value={name}
          onChange={handleChange}
          onClear={handleClearFilter}
        />

        {resultsToShow.length > 0 && (
          <div className={styles.results}>
            {resultsToShow.map((person) => (
              <button
                key={person.id}
                className={styles.resultItem}
                type="button"
                onClick={() => handleSelectPerson(person.nameRu)}
              >
                {person.nameRu}
              </button>
            ))}
          </div>
        )}
      </div>
    </FilterDropdown>
  );
};
