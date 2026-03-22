import type { SVGProps } from 'react';

export const BackArrowIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);
