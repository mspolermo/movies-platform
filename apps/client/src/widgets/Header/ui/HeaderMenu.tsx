'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './HeaderMenu.module.scss';

interface HeaderMenuProps {
  onDropdownOpen: (dropdownType: string) => void;
  onDropdownClose: () => void;
}

export const HeaderMenu: React.FC<HeaderMenuProps> = ({
  onDropdownOpen,
  onDropdownClose
}) => {
  const router = useRouter();

  const menuItems = [
    { id: 'films', label: 'Фильмы', href: '/films', hasDropdown: true },
    { id: 'cartoons', label: 'Мультфильмы', href: '/films/genre/мультфильм', hasDropdown: true }
  ];

  const handleItemClick = (item: typeof menuItems[0]) => {
    router.push(item.href);
  };

  const handleMouseEnter = (item: typeof menuItems[0]) => {
    if (item.hasDropdown) {
      onDropdownOpen(item.id);
    }
  };

  return (
    <nav className={styles.menu}>
      <ul className={styles.list}>
        {menuItems.map((item) => (
          <li key={item.id} className={styles.item}>
            <button
              className={styles.link}
              onClick={() => handleItemClick(item)}
              onMouseEnter={() => handleMouseEnter(item)}
              onMouseLeave={onDropdownClose}
              data-testid={item.id === 'films' ? 'moviesPageLink' : undefined}
            >
              <span className={styles.text}>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};