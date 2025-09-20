'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/features/auth/api/authStore/store';
import { Button, Logo } from '@/shared/ui';
import { HeaderSearch } from './components/HeaderSearch';
import { HeaderUser } from './components/HeaderUser';
import { HeaderDropdown } from './components/HeaderDropdown';
import styles from './Navbar.module.scss';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuthStore();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [showHeaderBackground, setShowHeaderBackground] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogout = () => {
    logout();
  };

  const handleDropdownOpen = (dropdownType: string) => {
    // Очищаем таймер закрытия если он есть
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsClosing(false);
    setActiveDropdown(dropdownType);
    setShowHeaderBackground(true); // Показываем фон хедера сразу
  };

  const handleDropdownClose = () => {
    if (activeDropdown && !isClosing) {
      setIsClosing(true);
      setShowHeaderBackground(false); // Убираем фон хедера сразу
      // Удаляем элемент из DOM после завершения анимации
      timeoutRef.current = setTimeout(() => {
        setActiveDropdown(null);
        setIsClosing(false);
      }, 400); // Время анимации закрытия
    }
  };

  const handleDropdownMouseEnter = () => {
    // Отменяем закрытие при наведении на дропдаун
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsClosing(false);
    setShowHeaderBackground(true); // Восстанавливаем фон хедера
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
        <div className={`${styles.content} ${showHeaderBackground ? styles.active : ''}`}>
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

        {(activeDropdown || isClosing) && (
          <HeaderDropdown
            activeDropdown={activeDropdown}
            isClosing={isClosing}
            onClose={handleDropdownClose}
            onMouseEnter={handleDropdownMouseEnter}
          />
        )}
      </div>
    </nav>
  );
};
