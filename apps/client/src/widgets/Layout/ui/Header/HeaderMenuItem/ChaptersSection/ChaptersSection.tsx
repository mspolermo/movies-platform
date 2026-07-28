'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ADMIN_NAV_ITEMS, hasAdminRole, isAdminNavActive, useAuth } from '@/entities/user';
import { FOOTER_SECTIONS_LAPTOP } from '@/widgets/Layout/constants';

import styles from './ChaptersSection.module.scss';

/**
 * Выпадающее меню «Разделы»: публичные главы и (для ADMIN) блок «Администрирование».
 */
export const ChaptersSection = () => {
  const pathname = usePathname() ?? '';
  const { user } = useAuth();
  const showAdmin = hasAdminRole(user);

  return (
    <div className={styles.root}>
      <div className={styles.grid}>
        <h3 className={styles.heading}>Разделы</h3>
        {FOOTER_SECTIONS_LAPTOP.map(({ label, url }) => (
          <Link
            key={label}
            aria-current={pathname === url ? 'page' : undefined}
            aria-label={label}
            className={styles.item}
            href={url}
          >
            {label}
          </Link>
        ))}
      </div>

      {showAdmin ? (
        <div className={styles.grid}>
          <h3 className={styles.heading}>Администрирование</h3>
          {ADMIN_NAV_ITEMS.map(({ label, href }) => (
            <Link
              key={href}
              aria-current={isAdminNavActive(pathname, href) ? 'page' : undefined}
              className={styles.item}
              href={href}
            >
              {label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
};
