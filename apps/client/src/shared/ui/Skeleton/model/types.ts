import type React from 'react';

export type TSkeletonProps = {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  variant?: 'rectangular' | 'circular';
  animation?: 'pulse' | 'wave' | 'none';
  children?: React.ReactNode;
};
