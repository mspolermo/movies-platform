import type { ImgHTMLAttributes } from 'react';

type TNextImageMockProps = ImgHTMLAttributes<HTMLImageElement> & {
  src?: string | { src: string };
  fill?: boolean;
  priority?: boolean;
  unoptimized?: boolean;
  quality?: number | `${number}`;
  placeholder?: string;
  blurDataURL?: string;
  loader?: unknown;
};

/**
 * Shared mock for `next/image` (Vitest + Storybook; Next 16 export path issues in Vite).
 * Next-only props не прокидываются в DOM.
 */
const NextImage = ({
  src,
  alt,
  fill,
  priority: _priority,
  unoptimized: _unoptimized,
  quality: _quality,
  placeholder: _placeholder,
  blurDataURL: _blurDataURL,
  loader: _loader,
  sizes,
  style,
  ...rest
}: TNextImageMockProps) => {
  const resolvedSrc = typeof src === 'string' ? src : src?.src;

  return (
    // eslint-disable-next-line @next/next/no-img-element -- intentional SB mock
    <img
      alt={alt ?? ''}
      sizes={sizes}
      src={resolvedSrc}
      style={
        fill
          ? {
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              ...style,
            }
          : style
      }
      {...rest}
    />
  );
};

export default NextImage;
