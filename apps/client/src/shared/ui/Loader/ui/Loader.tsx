import type { TLoaderProps } from '../model';

import classes from './Loader.module.scss';

export const Loader = ({
  size = 'medium',
  className = '',
  'aria-label': ariaLabel = 'Загрузка...',
}: TLoaderProps) => {
  const loaderClasses = [classes.loader, classes[`loader--${size}`], className]
    .filter(Boolean)
    .join(' ');

  return (
    <div aria-label={ariaLabel} className={loaderClasses} role="status">
      <div className={classes.loader__spinner}>
        <div className={classes.loader__ring}></div>
        <div className={classes.loader__ring}></div>
        <div className={classes.loader__ring}></div>
      </div>
    </div>
  );
};
