import type { SVGProps } from 'react';

export const BookmarkIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeWidth="1"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M6 4h12a2 2 0 0 1 2 2v14l-8-4-8 4V6a2 2 0 0 1 2-2z" />
  </svg>
);
