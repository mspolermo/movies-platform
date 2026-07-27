import type { TRemotePosterSize } from './types';

/** Слот постера → подсказка `sizes` для next/image (не CSS). */
export const REMOTE_POSTER_IMAGE_SIZES: Record<TRemotePosterSize, string> = {
  s: '(max-width: 600px) 72px, 100px',
  m: '(max-width: 480px) 100px, (max-width: 768px) 120px, (max-width: 1200px) 150px, 180px',
  l: '(max-width: 768px) 100vw, 600px',
};
