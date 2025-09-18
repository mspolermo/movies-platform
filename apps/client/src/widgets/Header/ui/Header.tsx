'use client';

import React, { useState } from 'react';
import { HeaderNavigation } from './HeaderNavigation';
import { HeaderSearch } from './HeaderSearch';
import { HeaderUser } from './HeaderUser';
import { HeaderDropdown } from './HeaderDropdown';
import styles from './Header.module.scss';

export const Header: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleDropdownOpen = (dropdownType: string) => {
    setActiveDropdown(dropdownType);
  };

  const handleDropdownClose = () => {
    setActiveDropdown(null);
  };

  return (
    <header className={styles.header} data-testid="header">
      <div className={styles.container}>
        <div className={`${styles.content} ${activeDropdown ? styles.active : ''}`}>
          <HeaderNavigation 
            onDropdownOpen={handleDropdownOpen}
            onDropdownClose={handleDropdownClose}
          />
          
          <div className={styles.actions}>
            <HeaderSearch />
            <HeaderUser />
          </div>
        </div>

        <HeaderDropdown
          activeDropdown={activeDropdown}
          onClose={handleDropdownClose}
        />
      </div>
    </header>
  );
};
