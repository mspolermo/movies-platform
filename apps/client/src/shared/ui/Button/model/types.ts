import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type TButtonVariant = 'default' | 'red' | 'outline';

export type TButtonSize = 'small' | 'medium' | 'large';

export interface TButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: TButtonVariant;
  size?: TButtonSize;
  loading?: boolean;
  icon?: ReactNode;
}
