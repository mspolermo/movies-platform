'use client';

import Link from 'next/link';
import { useState } from 'react';
import cn from 'classnames';

import { Logo } from '@/shared/ui';
import { SearchButton } from './SearchButton/SearchButton';
import { LoginButton } from './LoginButton/LoginButton';
import { QickFiltersList } from './QickFiltersList/QickFiltersList';

import { HeaderDropdown } from '@/features/openHeaderDropdown';

import styles from './Header.module.scss';
import { HEADER_SECTIONS_LAPTOP } from '../../constants';
import { ProfileSection } from './ProfileSection';
import { ChaptersSection } from './ChaptersSection';

export const Header = () => {
  const [openDropdownCount, setOpenDropdownCount] = useState(0);

  const handleDropdownOpenChange = (isOpen: boolean) => {
    setOpenDropdownCount((prev) => {
      if (isOpen) {
        return prev + 1;
      }

      const next = prev - 1;

      if (next < 0) {
        return 0;
      }

      return next;
    });
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div
          className={cn(styles.bar, {
            [styles.barActive]: openDropdownCount > 0,
          })}
        >
          <Link href="/" className={styles.logo}>
            <Logo />
          </Link>

          <nav className={styles.nav} aria-label="Main navigation">
            <ul className={styles.menu}>
              {HEADER_SECTIONS_LAPTOP.map(({ label, url, content }) => { 
                const isQickFiltersList = content == 'qickFiltersList'
                const isChaptersSection = content == 'chaptersSection'
                const isLink = !(isQickFiltersList || isChaptersSection)
                return (
                <li key={url} className={styles.item}>
                  {isQickFiltersList && (
                    <HeaderDropdown
                      onOpenChange={handleDropdownOpenChange}
                      trigger={({ onOpen }) => (
                        <Link
                          href={url}
                          className={styles.menuLink}
                          onMouseEnter={onOpen}
                        >
                          {label}
                        </Link>
                      )}
                    >
                      <QickFiltersList
                        onClose={() => {}}
                      />
                    </HeaderDropdown>
                  )}

                {isChaptersSection && (
                    <HeaderDropdown
                      onOpenChange={handleDropdownOpenChange}
                      trigger={({ onOpen }) => (
                        <Link
                          href={url}
                          className={styles.menuLink}
                          onMouseEnter={onOpen}
                        >
                          {label}
                        </Link>
                      )}
                    >
                      <ChaptersSection
                      />
                    </HeaderDropdown>
                  )}

                  {isLink && (
                    <Link
                      href={url}
                      className={styles.menuLink}
                    >
                      {label}
                    </Link>
                  )}
                </li>
              )})}
            </ul>
          </nav>

          <div className={styles.actions}>
            <SearchButton />
            
            <HeaderDropdown
              onOpenChange={handleDropdownOpenChange}
              trigger={({ onOpen }) => (
                <LoginButton onOpen={onOpen}/>
              )}
            >
              <ProfileSection
                onClose={() => {}}
              />
            </HeaderDropdown>
          </div>
        </div>
      </div>
    </header>
  );
};