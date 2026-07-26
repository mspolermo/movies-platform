import type { SVGProps } from 'react';

export const ShareIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" {...props}>
    <path
      d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M12 4v12" strokeLinecap="round" />
    <path d="m8 8 4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
