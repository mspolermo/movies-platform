import React from 'react';
import styles from './SvgIcon.module.scss';

export interface SvgIconProps {
  name?: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  size?: number | string;
  className?: string;
  color?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  onClick?: (e: React.MouseEvent) => void;
  'aria-label'?: string;
}

// Простые SVG иконки
const icons = {
  'quote-open': (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
    </svg>
  ),
  'quote-close': (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
    </svg>
  ),
  'circle-filled': (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="10"/>
    </svg>
  ),
  'volume-down': (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>
    </svg>
  ),
  'keyboard': (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V8h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z"/>
    </svg>
  ),
  'image-icon': (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
    </svg>
  ),
};

export const SvgIcon: React.FC<SvgIconProps> = ({
  name,
  icon: IconComponent,
  size = 24,
  className = '',
  color,
  fill,
  stroke,
  strokeWidth,
  onClick,
  'aria-label': ariaLabel,
  ...props
}) => {
  const iconClasses = [
    styles.svgIcon,
    className,
  ].filter(Boolean).join(' ');

  const iconStyle: React.CSSProperties = {
    width: typeof size === 'number' ? `${size}px` : size,
    height: typeof size === 'number' ? `${size}px` : size,
    color: color,
    fill: fill,
    stroke: stroke,
    strokeWidth: strokeWidth,
  };

  // Если передан name, используем встроенные иконки
  if (name && icons[name as keyof typeof icons]) {
    const IconComponent = icons[name as keyof typeof icons];
    return (
      <IconComponent
        className={iconClasses}
        style={iconStyle}
        onClick={onClick}
        aria-label={ariaLabel}
        {...props}
      />
    );
  }

  // Если передан icon как компонент
  if (IconComponent) {
    return (
      <IconComponent
        className={iconClasses}
        style={iconStyle}
        onClick={onClick}
        aria-label={ariaLabel}
        {...props}
      />
    );
  }

  return null;
};
