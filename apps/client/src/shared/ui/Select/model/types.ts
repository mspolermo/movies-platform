import type { SelectHTMLAttributes } from 'react';

export type TSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type TSelectSize = 'small' | 'medium' | 'large';

type TSelectBase = {
  label?: string;
  options: TSelectOption[];
  error?: string;
  size?: TSelectSize;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
};

export type TSelectSingleProps = TSelectBase &
  Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'multiple' | 'value' | 'onChange'> & {
    multiple?: false;
    value: string;
    onChange: (value: string) => void;
  };

export type TSelectMultipleProps = TSelectBase & {
  multiple: true;
  value: string[];
  onChange: (value: string[]) => void;
  /** Сколько строк видно в списке множественного выбора (по умолчанию min(6, options)). */
  visibleRows?: number;
  name?: string;
  id?: string;
};

export type TSelectProps = TSelectSingleProps | TSelectMultipleProps;
