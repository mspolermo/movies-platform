'use client';

import type { TCardProps } from '../model';

import type { KeyboardEvent } from 'react';

import cn from 'classnames';

import { RemotePoster } from '@/shared/ui/RemotePoster';

import styles from './Card.module.scss';

export const Card = ({ type = 'small', title, photoUrl, role, onClick }: TCardProps) => {
  const isSmall = type === 'small';

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={cn(styles.root, isSmall ? styles.rootSmall : styles.rootBig)}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? handleKeyDown : undefined}
    >
      <div className={cn(styles.body, isSmall ? styles.bodySmall : styles.bodyBig)}>
        <RemotePoster
          alt={title ?? ''}
          className={cn(styles.img, isSmall ? styles.imgSmall : styles.imgBig)}
          fallbackClassName={styles.imageError}
          fallbackIconSize={24}
          fallbackLabel=""
          size="s"
          skeletonBorderRadius="inherit"
          src={photoUrl}
        />
      </div>
      <div>
        {title && (
          <p className={cn(styles.title, isSmall ? styles.titleSmall : styles.titleBig)}>{title}</p>
        )}
        {role && <p className={styles.role}>{role}</p>}
      </div>
    </div>
  );
};
