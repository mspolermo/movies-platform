'use client';

import cn from 'classnames';
import Link from 'next/link';
import { useState } from 'react';

import { HeaderDropdown } from '@/features/openHeaderDropdown';
import { Logo } from '@/shared/ui';

import styles from './Header.module.scss';
import { HeaderMenuItem } from './HeaderMenuItem';
import { LoginButton } from './LoginButton';
import { ProfileSection } from './ProfileSection';
import { SearchButton } from './SearchButton';
import { HEADER_SECTIONS_LAPTOP } from '../../constants';

/**
 * Основной хедер приложения.
 * Отвечает за навигацию и отображение dropdown-меню.
 * Активирует фон хедера, если открыт хотя бы один dropdown.
 */
export const Header = () => {
  /** Количество открытых dropdown внутри хедера */
  const [openDropdownCount, setOpenDropdownCount] = useState(0);

  /**
   * Обработчик изменения состояния dropdown.
   * Используется для синхронизации состояния фона хедера.
   */
  const handleDropdownOpenChange = (isOpen: boolean) => {
    setOpenDropdownCount((prev) => {
      if (isOpen) {
        return prev + 1;
      }

      const next = prev - 1;

      // Защита от отрицательных значений
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
            // Активируем фон если открыт хотя бы один dropdown
            [styles.barActive]: openDropdownCount > 0,
          })}
        >
          <Link className={styles.logo} href="/">
            <Logo />
          </Link>

          <nav aria-label="Main navigation" className={styles.nav}>
            <ul className={styles.menu}>
              {HEADER_SECTIONS_LAPTOP.map((item, i) => (
                <li key={`${item.label}-${i}`} className={styles.item}>
                  <HeaderMenuItem
                    item={item}
                    onDropdownOpenChange={handleDropdownOpenChange}
                  />
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.actions}>
            <SearchButton />

            {/* Dropdown профиля */}
            <HeaderDropdown
              content={() => <ProfileSection />}
              trigger={({ onOpen }) => <LoginButton onOpen={onOpen} />}
              onOpenChange={handleDropdownOpenChange}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
