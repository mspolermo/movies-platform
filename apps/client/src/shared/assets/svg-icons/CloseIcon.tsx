import React from 'react';

export const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1"
    {...props}
  >
    <path d="M18 6L6 18" />
    <path d="M6 6l12 12" />
  </svg>
);
