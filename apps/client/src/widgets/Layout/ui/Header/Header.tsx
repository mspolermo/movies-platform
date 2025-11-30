'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/features/auth/api/authStore/store';
import { Button, Logo } from '@/shared/ui';
import { HeaderSearch } from './components/HeaderSearch/HeaderSearch';
import { LoginButton } from './components/LoginButton/LoginButton';
import { Dropdown } from './components/Dropdown/Dropdown';
import styles from './Header.module.scss';

export const Header = () => {
  const { user, logout, isAuthenticated } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showHeaderBackground, setShowHeaderBackground] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogout = () => {
    logout();
  };

  const handleDropdownOpen = () => {
    // Очищаем таймер закрытия если он есть
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsDropdownOpen(true);
    setIsClosing(false);
    setShowHeaderBackground(true); // Показываем фон хедера сразу
  };

  const handleDropdownClose = () => {
    if (!isClosing) {
      setIsClosing(true);
      setShowHeaderBackground(false); // Убираем фон хедера сразу
      // Удаляем элемент из DOM после завершения анимации
      timeoutRef.current = setTimeout(() => {
        setIsDropdownOpen(false);
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
    setIsDropdownOpen(true);
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
        <div
          className={`${styles.content} ${showHeaderBackground ? styles.active : ''}`}
        >
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <Logo />
            </Link>
          </div>

          <div className={styles.menu}>
          <Link href="/films" className={styles.link}>
            <button
              className={styles.link}
              onMouseEnter={() => handleDropdownOpen()}
              onMouseLeave={handleDropdownClose}
            >
              Фильмы
            </button>
            </Link>
            <Link href="/films?genres=мультфильм" className={styles.link}>
              Мультфильмы
            </Link>
            <Link href="/debug" className={styles.link}>
              Debug
            </Link>
          </div>

          <div className={styles.actions}>
            <HeaderSearch />
            <LoginButton />
          </div>
        </div>

        {isDropdownOpen && (
          <Dropdown
            isClosing={isClosing}
            onClose={handleDropdownClose}
            onMouseEnter={handleDropdownMouseEnter}
          />
        )}
      </div>
    </nav>
  );
};
