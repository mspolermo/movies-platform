import type { SVGProps } from 'react';

export const CopyIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" {...props}>
    <rect height="13" rx="2" width="13" x="8" y="8" />
    <path d="M4 16V6a2 2 0 0 1 2-2h10" strokeLinecap="round" />
  </svg>
);
