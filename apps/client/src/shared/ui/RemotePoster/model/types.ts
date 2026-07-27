import type { TSkeletonProps } from '@/shared/ui/Skeleton';

/** Слот постера → подсказка `sizes` для next/image (не CSS). */
export type TRemotePosterSize = 's' | 'm' | 'l';

export type TRemotePosterProps = {
  src?: string | null;
  alt: string;
  size: TRemotePosterSize;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  fallbackClassName?: string;
  fallbackLabel?: string;
  fallbackIconSize?: number;
  skeletonClassName?: string;
  skeletonBorderRadius?: string | number;
  skeletonAnimation?: TSkeletonProps['animation'];
};
