'use client';

import type { TFilterDropdownBlockId } from '../types';

import type { ReactNode } from 'react';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

type TFiltersDropdownContextValue = {
  openBlockId: TFilterDropdownBlockId | null;
  toggleBlock: (blockId: TFilterDropdownBlockId) => void;
  close: () => void;
  isOpen: (blockId: TFilterDropdownBlockId) => boolean;
};

const FiltersDropdownContext = createContext<TFiltersDropdownContextValue | null>(null);

export const useFiltersDropdown = (): TFiltersDropdownContextValue => {
  const ctx = useContext(FiltersDropdownContext);
  if (!ctx) {
    throw new Error('useFiltersDropdown must be used within FiltersDropdownProvider');
  }
  return ctx;
};

type TFiltersDropdownProviderProps = {
  children: ReactNode;
};

export const FiltersDropdownProvider = ({ children }: TFiltersDropdownProviderProps) => {
  const [openBlockId, setOpenBlockId] = useState<TFilterDropdownBlockId | null>(null);

  const close = useCallback(() => setOpenBlockId(null), []);

  const toggleBlock = useCallback((blockId: TFilterDropdownBlockId) => {
    setOpenBlockId((prev) => (prev === blockId ? null : blockId));
  }, []);

  const isOpen = useCallback(
    (blockId: TFilterDropdownBlockId) => openBlockId === blockId,
    [openBlockId]
  );

  const value = useMemo(
    () => ({ openBlockId, toggleBlock, close, isOpen }),
    [openBlockId, toggleBlock, close, isOpen]
  );

  return (
    <FiltersDropdownContext.Provider value={value}>{children}</FiltersDropdownContext.Provider>
  );
};
