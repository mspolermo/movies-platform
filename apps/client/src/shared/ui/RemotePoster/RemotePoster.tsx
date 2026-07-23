'use client';

import type { SkeletonProps } from '../Skeleton';

import cn from 'classnames';
import Image from 'next/image';
import { useState } from 'react';

import { ImageIcon } from '@/shared/assets';
import { shouldSkipImageOptimization } from '@/shared/lib';

import styles from './RemotePoster.module.scss';
import { Skeleton } from '../Skeleton';
import { SvgIcon } from '../SvgIcon';

/** Слот постера → подсказка `sizes` для next/image (не CSS). */
export type RemotePosterSize = 's' | 'm' | 'l';

const IMAGE_SIZES: Record<RemotePosterSize, string> = {
  s: '(max-width: 600px) 72px, 100px',
  m: '(max-width: 480px) 100px, (max-width: 768px) 120px, (max-width: 1200px) 150px, 180px',
  l: '(max-width: 768px) 100vw, 600px',
};

export type RemotePosterProps = {
  src?: string | null;
  alt: string;
  /** Пресет слота: s ~80–100px, m ~FilmCard, l ~detail. */
  size: RemotePosterSize;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  fallbackClassName?: string;
  /** Default «Нет изображения»; `''` — только иконка. */
  fallbackLabel?: string;
  fallbackIconSize?: number;
  skeletonClassName?: string;
  skeletonBorderRadius?: string | number;
  skeletonAnimation?: SkeletonProps['animation'];
};

/**
 * Outer: `key` по src → remount при смене URL без useEffect-race
 * (кэшированный onLoad успевает до effect → skeleton залипал).
 */
export const RemotePoster = (props: RemotePosterProps) => {
  const posterSrc = props.src?.trim() || '';

  return <RemotePosterInner key={posterSrc || '__empty'} {...props} posterSrc={posterSrc} />;
};

type RemotePosterInnerProps = RemotePosterProps & { posterSrc: string };

const RemotePosterInner = ({
  posterSrc,
  alt,
  size,
  priority = false,
  className,
  imageClassName,
  fallbackClassName,
  fallbackLabel = 'Нет изображения',
  fallbackIconSize = 48,
  skeletonClassName,
  skeletonBorderRadius = '8px',
  skeletonAnimation = 'pulse',
}: RemotePosterInnerProps) => {
  const [imageError, setImageError] = useState(!posterSrc);
  const [imageLoading, setImageLoading] = useState(Boolean(posterSrc));

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  if (!posterSrc || imageError) {
    const showLabel = fallbackLabel.length > 0;

    return (
      <div
        aria-label={showLabel ? undefined : 'Изображение недоступно'}
        className={cn(styles.fallback, fallbackClassName, className)}
        role={showLabel ? undefined : 'img'}
      >
        <div
          aria-hidden
          className={cn(styles.fallbackIcon, showLabel && styles.fallbackIconWithLabel)}
        >
          <SvgIcon icon={ImageIcon} size={fallbackIconSize} />
        </div>
        {showLabel && <div className={styles.fallbackLabel}>{fallbackLabel}</div>}
      </div>
    );
  }

  return (
    <div className={cn(styles.root, className)}>
      <Image
        fill
        alt={alt}
        className={cn(
          styles.image,
          imageLoading ? styles.imageLoading : styles.imageLoaded,
          imageClassName
        )}
        priority={priority}
        sizes={IMAGE_SIZES[size]}
        src={posterSrc}
        unoptimized={shouldSkipImageOptimization(posterSrc)}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
      {imageLoading && (
        <Skeleton
          animation={skeletonAnimation}
          borderRadius={skeletonBorderRadius}
          className={cn(styles.skeleton, skeletonClassName)}
          height="100%"
          variant="rectangular"
          width="100%"
        />
      )}
    </div>
  );
};
