'use client';

import { SvgIcon } from '@/shared/ui';
import styles from './styles/MobileFooter.module.scss';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FOOTER_SECTIONS_MOBILE } from '../../constants';

export const MobileFooter = () => {
  const pathname = usePathname();
  
  return (
    <footer className={styles.footer}>
      <nav className={styles.bottomBar} aria-label="Mobile navigation">
        <ul className={styles.navList}>
          {FOOTER_SECTIONS_MOBILE.map((item) => (
            <li key={item.label}>
              <Link
                className={styles.navItem}
                href={item.url}
                aria-label={item.label}
                aria-current={pathname === item.url ? 'page' : undefined}
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