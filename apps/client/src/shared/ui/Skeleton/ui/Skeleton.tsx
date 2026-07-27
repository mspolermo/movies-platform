import type { TSkeletonProps } from '../model';

import React from 'react';

import styles from './Skeleton.module.scss';

export const Skeleton = ({
  width,
  height,
  borderRadius,
  className = '',
  variant = 'rectangular',
  animation = 'pulse',
  children,
}: TSkeletonProps) => {
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

  const skeletonClasses = [styles.skeleton, styles[variant], styles[animation], className]
    .filter(Boolean)
    .join(' ');

  if (children) {
    return (
      <div className={skeletonClasses} style={style}>
        {children}
      </div>
    );
  }

  return <div aria-label="Загрузка..." className={skeletonClasses} style={style} />;
};
