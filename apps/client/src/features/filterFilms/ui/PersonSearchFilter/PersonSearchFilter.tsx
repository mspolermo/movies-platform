import { useState, useCallback } from 'react';

import styles from './PersonSearchFilter.module.scss';
import { usePersonSearch } from '../../lib';

//TODO: Нужно добавить сброс фильтра по крестику в input
interface PersonSearchFilterProps {
  onChangeFilter: (person: string) => void;
  professionId: number;
  setActiveBlock: (activeBlockName: string[]) => void;
}

export const PersonSearchFilter = ({
  onChangeFilter,
  professionId,
  setActiveBlock,
}: PersonSearchFilterProps) => {
  const [name, setName] = useState('');

  const { results } = usePersonSearch({
    professionId,
    name,
  });

  const handleSelectPerson = useCallback(
    (name: string) => {
      onChangeFilter(name);
      setName('');
      setActiveBlock([]);
    },
    [onChangeFilter, setActiveBlock]
  );

  return (
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
  );
};
