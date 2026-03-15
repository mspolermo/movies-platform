'use client';

import Link from 'next/link';
import { Logo } from '@/shared/ui';
import { SearchButton } from './SearchButton/SearchButton';
import { LoginButton } from './LoginButton/LoginButton';
import { Dropdown } from './Dropdown/Dropdown';
import styles from './Header.module.scss';
import { HEADER_SECTIONS_LAPTOP } from '../../constants';
import { useAnimatedDropdown } from '../../lib';
import cn from 'classnames';

export const Header = () => {
  const {
    isDropdownOpen,
    onDropdownOpen,
    onDropdownClose,
  } = useAnimatedDropdown();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div
          className={cn(styles.bar, {
            [styles.barActive]: isDropdownOpen
          })}
        >
          <Link href="/" className={styles.logo}>
            <Logo />
          </Link>

          <nav className={styles.nav} aria-label="Main navigation">
            <ul className={styles.menu}>
              {HEADER_SECTIONS_LAPTOP.map(({ label, url, openable }) => (
                <li key={url}>
                  <Link
                    href={url}
                    className={styles.menuLink}
                    onMouseEnter={openable ? onDropdownOpen : undefined}
                    onMouseLeave={openable ? onDropdownClose : undefined}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.actions}>
            <SearchButton />
            <LoginButton />
          </div>
        </div>

          <Dropdown
            isOpen={isDropdownOpen}
            onClose={onDropdownClose}
          />
      </div>
    </header>
  );
};