'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { SvgIcon } from '@/shared/ui';

import styles from './styles/MobileFooter.module.scss';
import { FOOTER_SECTIONS_MOBILE } from '../../constants';

export const MobileFooter = () => {
  const pathname = usePathname();

  return (
    <footer className={styles.footer}>
      <nav aria-label="Mobile navigation" className={styles.bottomBar}>
        <ul className={styles.navList}>
          {FOOTER_SECTIONS_MOBILE.map((item) => (
            <li key={item.label}>
              <Link
                aria-current={pathname === item.url ? 'page' : undefined}
                aria-label={item.label}
                className={styles.navItem}
                href={item.url}
              >
                <SvgIcon name={item.icon} size={20} />
                <span className={styles.label}>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  );
};
