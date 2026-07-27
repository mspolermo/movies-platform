import type { TBreadcrumbsProps } from '../model';

import cn from 'classnames';
import Link from 'next/link';

import styles from './Breadcrumbs.module.scss';

/**
 * Хлебные крошки: декларативный trail по `items`.
 * Элемент без `href` — текст; последний без ссылки получает `aria-current="page"`.
 * Labels рендерятся as-is (без нормализации регистра).
 */
export const Breadcrumbs = ({
  items,
  className,
  'aria-label': ariaLabel = 'Хлебные крошки',
}: TBreadcrumbsProps) => {
  if (items.length === 0) return null;

  return (
    <nav aria-label={ariaLabel} className={cn(styles.root, className)}>
      <ol className={styles.list}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isLink = Boolean(item.href) && !isLast;

          return (
            <li key={`${item.label}-${index}`} className={styles.item}>
              {isLink ? (
                <Link className={styles.link} href={item.href!}>
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? 'page' : undefined} className={styles.current}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
