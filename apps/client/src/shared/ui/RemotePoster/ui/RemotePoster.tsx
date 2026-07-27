'use client';

import type { TRemotePosterProps } from '../model';

import cn from 'classnames';
import Image from 'next/image';
import { useState } from 'react';

import { shouldSkipImageOptimization } from '@/shared/lib';
import { Skeleton } from '@/shared/ui/Skeleton';
import { SvgIcon } from '@/shared/ui/SvgIcon';

import { REMOTE_POSTER_IMAGE_SIZES } from '../model';
import styles from './RemotePoster.module.scss';

/**
 * Outer: `key` по src → remount при смене URL без useEffect-race
 * (кэшированный onLoad успевает до effect → skeleton залипал).
 */
export const RemotePoster = (props: TRemotePosterProps) => {
  const posterSrc = props.src?.trim() || '';

  return <RemotePosterInner key={posterSrc || '__empty'} {...props} posterSrc={posterSrc} />;
};

type RemotePosterInnerProps = TRemotePosterProps & { posterSrc: string };

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
          <SvgIcon icon="image" size={fallbackIconSize} />
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
        sizes={REMOTE_POSTER_IMAGE_SIZES[size]}
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
