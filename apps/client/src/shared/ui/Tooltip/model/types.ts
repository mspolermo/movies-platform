import type { ReactNode } from 'react';

export type TTooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export type TTooltipProps = {
  content: string | ReactNode;
  children: ReactNode;
  position?: TTooltipPosition;
  delay?: number;
  disabled?: boolean;
  className?: string;
};

export type TTooltipCoords = {
  top: number;
  left: number;
};
