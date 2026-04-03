import type { TPersonSearchingProps } from '../../../../model';

import { useState, useCallback } from 'react';

import styles from './PersonSearching.module.scss';
import { usePersonSearch } from '../../../../lib';
import { useFiltersDropdown } from '../../../../model';
import { FilterDropdown } from '../FilterDropdown';

//TODO: Нужно добавить сброс фильтра по крестику в input
// и поиск не по id профессии должен быть явно
export const PersonSearching = <T extends 'actor' | 'producer'>({
  type,
  selectedValue,
  onChange,
}: TPersonSearchingProps<T>) => {
  const [name, setName] = useState('');
  const { close } = useFiltersDropdown();

  const { results } = usePersonSearch({
    professionId: type === 'producer' ? 2 : 1,
    name,
  });

  const handleSelectPerson = useCallback(
    (personName: string) => {
      onChange({
        [type]: personName,
      });
      setName('');
      close();
    },
    [onChange, type, close]
  );

  return (
    <FilterDropdown
      blockName={type}
      filterName={type === 'producer' ? 'Режиссер' : 'Актер'}
      selectedFiltersBy={selectedValue}
    >
      <div className={styles.root}>
        <input
          className={styles.input}
          placeholder="Введите имя…"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {results.length > 0 && (
          <div className={styles.results}>
            {results.map((person) => (
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
