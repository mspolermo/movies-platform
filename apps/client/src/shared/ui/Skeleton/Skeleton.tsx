import React from 'react';
import styles from './Skeleton.module.scss';

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text';
  animation?: 'pulse' | 'wave' | 'none';
  children?: React.ReactNode;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  borderRadius,
  className = '',
  variant = 'rectangular',
  animation = 'pulse',
  children,
}) => {
  const style: React.CSSProperties = {
    ...(width !== undefined && {
      width: typeof width === 'number' ? `${width}px` : width,
    }),
    ...(height !== undefined && {
      height: typeof height === 'number' ? `${height}px` : height,
    }),
    ...(borderRadius !== undefined && {
      borderRadius:
        variant === 'circular'
          ? '50%'
          : typeof borderRadius === 'number'
            ? `${borderRadius}px`
            : borderRadius,
    }),
  };

  const skeletonClasses = [
    styles.skeleton,
    styles[variant],
    styles[animation],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (children) {
    return (
      <div className={skeletonClasses} style={style}>
        {children}
      </div>
    );
  }

  return (
    <div className={skeletonClasses} style={style} aria-label="Загрузка..." />
  );
};
