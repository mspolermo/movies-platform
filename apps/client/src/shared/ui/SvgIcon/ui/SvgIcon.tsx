import type { TSvgIconProps } from '../model';

import { iconsLibrary } from '../constants';
import styles from './SvgIcon.module.scss';

/**
 * Рендерит зарегистрированную SVG-иконку по ключу `icon`.
 * Цвет — через CSS (`currentColor` + токены); клик — на обёртке-кнопке.
 */
export const SvgIcon = ({
  icon,
  size = 24,
  className = '',
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
}: TSvgIconProps) => {
  const IconComponent = iconsLibrary[icon];
  const iconClasses = [styles.svgIcon, className].filter(Boolean).join(' ');
  const dimension = typeof size === 'number' ? `${size}px` : size;
  const resolvedAriaHidden = ariaHidden ?? (ariaLabel ? undefined : true);

  return (
    <IconComponent
      aria-hidden={resolvedAriaHidden}
      aria-label={ariaLabel}
      className={iconClasses}
      role={ariaLabel ? 'img' : undefined}
      style={{ width: dimension, height: dimension }}
    />
  );
};
