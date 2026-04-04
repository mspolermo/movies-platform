'use client';

import type { TPersonSearchingProps } from '../../model';

import type { ChangeEvent } from 'react';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useFiltersDropdown } from '../../model';

type TUsePersonFilterFieldParams<T extends 'actor' | 'producer'> = Pick<
  TPersonSearchingProps<T>,
  'type' | 'selectedValue' | 'onChange'
>;

/**
 * Локальное состояние строки поиска и обработчики для фильтра актёр/режиссёр:
 * синхронизация с `selectedValue`, сброс черновика при закрытии дропдауна.
 * Данные подсказок подключаются отдельно (`usePersonSearchQuery`).
 */
export const usePersonFilterField = <T extends 'actor' | 'producer'>({
  type,
  selectedValue,
  onChange,
}: TUsePersonFilterFieldParams<T>) => {
  const [name, setName] = useState(selectedValue);
  const skipSelectedSyncRef = useRef(false);
  const wasDropdownOpenRef = useRef(false);
  const { close, openBlockId } = useFiltersDropdown();

  useEffect(() => {
    if (skipSelectedSyncRef.current) {
      skipSelectedSyncRef.current = false;
      return;
    }
    setName(selectedValue);
  }, [selectedValue]);

  useEffect(() => {
    const open = openBlockId === type;
    if (wasDropdownOpenRef.current && !open) {
      setName(selectedValue);
    }
    wasDropdownOpenRef.current = open;
  }, [openBlockId, type, selectedValue]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setName(v);
      if (selectedValue) {
        skipSelectedSyncRef.current = true;
        onChange({ [type]: '' });
      }
    },
    [onChange, selectedValue, type]
  );

  const handleClearFilter = useCallback(() => {
    setName('');
    if (selectedValue) {
      onChange({ [type]: '' });
    }
  }, [onChange, selectedValue, type]);

  const handleSelectPerson = useCallback(
    (personName: string) => {
      onChange({
        [type]: personName,
      });
      setName(personName);
      close();
    },
    [onChange, type, close]
  );

  return {
    name,
    handleChange,
    handleClearFilter,
    handleSelectPerson,
  };
};
