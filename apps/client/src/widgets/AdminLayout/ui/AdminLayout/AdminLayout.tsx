'use client';

import type { PropsWithChildren } from 'react';

import cn from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ADMIN_NAV_ITEMS, isAdminNavActive } from '@/entities/user';

import styles from './AdminLayout.module.scss';

/**
 * Оболочка админки: сайдбар и контент. Шлюз auth/ролей — pages/AdminRootLayout.
 */
export const AdminLayout = ({ children }: PropsWithChildren) => {
  const pathname = usePathname() ?? '/admin';

  return (
    <div className={styles.root}>
      <div className={styles.sidebarCol}>
        <aside aria-label="Разделы администрирования" className={styles.sidebar}>
          <p className={styles.sidebarTitle}>Администрирование</p>
          <nav>
            <ul className={styles.navList}>
              {ADMIN_NAV_ITEMS.map((item) => {
                const active = isAdminNavActive(pathname, item.href);

                return (
                  <li key={item.href}>
                    <Link
                      aria-current={active ? 'page' : undefined}
                      className={cn(styles.navLink, active && styles.navLinkActive)}
                      href={item.href}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
};
