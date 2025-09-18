'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/features/auth/api/authStore/store';
import { Button, Logo } from '@/shared/ui';
import { HeaderSearch } from '../../Header/ui/HeaderSearch';
import { HeaderUser } from '../../Header/ui/HeaderUser';
import { HeaderDropdown } from '../../Header/ui/HeaderDropdown';
import styles from './Navbar.module.scss';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuthStore();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogout = () => {
    logout();
  };

  const handleDropdownOpen = (dropdownType: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveDropdown(dropdownType);
  };

  const handleDropdownClose = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150); // Небольшая задержка для плавного перехода
  };

  const handleDropdownMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // Очистка таймера при размонтировании
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={`${styles.content} ${activeDropdown ? styles.active : ''}`}>
          <div className={styles.brand}>
            <Link href="/films" className={styles.logo}>
              <Logo />
            </Link>
          </div>

          <div className={styles.menu}>
            <button
              className={styles.link}
              onMouseEnter={() => handleDropdownOpen('films')}
              onMouseLeave={handleDropdownClose}
            >
              Фильмы
            </button>
            <Link href="/genres" className={styles.link}>
              Жанры
            </Link>
            <Link href="/countries" className={styles.link}>
              Страны
            </Link>
            <Link href="/persons" className={styles.link}>
              Персоны
            </Link>
            <Link href="/professions" className={styles.link}>
              Профессии
            </Link>
            <Link href="/debug" className={styles.link}>
              Debug
            </Link>
          </div>

          <div className={styles.actions}>
            <HeaderSearch />
            <HeaderUser />
          </div>
        </div>

        <HeaderDropdown
          activeDropdown={activeDropdown}
          onClose={handleDropdownClose}
          onMouseEnter={handleDropdownMouseEnter}
        />
      </div>
    </nav>
  );
};
