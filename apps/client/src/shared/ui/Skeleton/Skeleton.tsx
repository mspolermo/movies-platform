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
  width = '100%',
  height = '1rem',
  borderRadius = '4px',
  className = '',
  variant = 'rectangular',
  animation = 'pulse',
  children,
}) => {
  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    borderRadius:
      variant === 'circular'
        ? '50%'
        : typeof borderRadius === 'number'
          ? `${borderRadius}px`
          : borderRadius,
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
