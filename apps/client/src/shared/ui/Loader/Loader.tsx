import React from "react";
import classes from './Loader.module.scss';

export interface LoaderProps {
  /** Размер лоадера */
  size?: 'small' | 'medium' | 'large';
  /** Дополнительный CSS класс */
  className?: string;
  /** Текст для скринридеров */
  'aria-label'?: string;
}

const Loader: React.FC<LoaderProps> = ({ 
  size = 'medium', 
  className = '',
  'aria-label': ariaLabel = 'Загрузка...'
}) => {
  const loaderClasses = [
    classes.loader,
    classes[`loader--${size}`],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={loaderClasses} role="status" aria-label={ariaLabel}>
      <div className={classes.loader__spinner}>
        <div className={classes.loader__ring}></div>
        <div className={classes.loader__ring}></div>
        <div className={classes.loader__ring}></div>
      </div>
    </div>
  );
};

export default Loader;