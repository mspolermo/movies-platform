import React from 'react';
import styles from './SvgIcon.module.scss';

export interface SvgIconProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  size?: number | string;
  className?: string;
  color?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  onClick?: (e: React.MouseEvent) => void;
  'aria-label'?: string;
}

export const SvgIcon: React.FC<SvgIconProps> = ({
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

  return (
    <IconComponent
      className={iconClasses}
      style={iconStyle}
      onClick={onClick}
      aria-label={ariaLabel}
      {...props}
    />
  );
};
