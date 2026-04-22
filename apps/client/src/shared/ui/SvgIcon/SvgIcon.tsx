import React from 'react';

import { iconsLibrary } from './IconsLibrary';
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

export const SvgIcon = ({
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
}: SvgIconProps) => {
  const iconClasses = [styles.svgIcon, className].filter(Boolean).join(' ');

  const iconStyle: React.CSSProperties = {
    width: typeof size === 'number' ? `${size}px` : size,
    height: typeof size === 'number' ? `${size}px` : size,
    color: color,
    fill: fill,
    stroke: stroke,
    strokeWidth: strokeWidth,
  };

  // Если передан name, используем встроенные иконки
  if (name && iconsLibrary[name as keyof typeof iconsLibrary]) {
    const IconComponent = iconsLibrary[name as keyof typeof iconsLibrary];
    return (
      <IconComponent
        aria-label={ariaLabel}
        className={iconClasses}
        style={iconStyle}
        onClick={onClick}
        {...props}
      />
    );
  }

  // Если передан icon как компонент
  if (IconComponent) {
    return (
      <IconComponent
        aria-label={ariaLabel}
        className={iconClasses}
        style={iconStyle}
        onClick={onClick}
        {...props}
      />
    );
  }

  return null;
};
