import type { SVGProps } from 'react';

export const CloseIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeWidth="1"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M18 6L6 18" />
    <path d="M6 6l12 12" />
  </svg>
);
