import type { InputHTMLAttributes } from 'react';

export type TInputSize = 'small' | 'medium' | 'large';

export interface TInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  clearable?: boolean;
  onClear?: () => void;
  className?: string;
  size?: TInputSize;
}
