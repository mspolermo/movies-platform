import React, { useState, useEffect } from 'react';
import apiClient from '@/shared/api/client';
import { API_ENDPOINTS } from '@/shared/api/endpoints';
import styles from './PersonSearchFilter.module.scss';

interface Person {
  id: number;
  nameRu: string;
  nameEn: string;
}

interface PersonSearchFilterProps {
  handleChangeFilter: (person: string) => void;
  professionId: number; // 1 - актер, 2 - режиссер
  setActiveBlock: (activeBlockName: string[]) => void;
}

export const PersonSearchFilter: React.FC<PersonSearchFilterProps> = ({
  handleChangeFilter,
  professionId,
  setActiveBlock
}) => {
  const [searchResults, setSearchResults] = useState<Person[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (searchQuery) {
      fetchPersons();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, professionId]);

  const select = (value: string) => {
    handleChangeFilter(value);
    setSearchResults([]);
    setActiveBlock([]);
  };

  const renderResult = (value: Person) => {
    return (
      <div
        key={value.id}
        className={styles.searchResult}
        onClick={() => select(value.nameRu)}
      >
        {value.nameRu}
      </div>
    );
  };

  const fetchPersons = async () => {
    try {
      const { data } = await apiClient.get(API_ENDPOINTS.PERSONS_EX.SEARCH_FIND, {
        params: { professionId, name: searchQuery },
      });
      
      const searchResults = data.map((item: any) => ({
        id: item.id,
        nameRu: item.nameRu,
        nameEn: item.nameEn,
      }));
      
      setSearchResults(searchResults);
    } catch (error) {
      console.error('Ошибка поиска персон:', error);
      setSearchResults([]);
    }
  };

  return (
    <div className={styles.personSearchFilter}>
      <div className={styles.content}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Введите имя..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        {searchResults.length > 0 && (
          <div className={styles.results}>
            {searchResults.map((result) => renderResult(result))}
          </div>
        )}
      </div>
    </div>
  );
};
