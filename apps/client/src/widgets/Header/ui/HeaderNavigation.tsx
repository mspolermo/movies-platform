'use client';

import React from 'react';
import { Logo } from '../../../shared/ui/Logo';
import { HeaderMenu } from './HeaderMenu';
import styles from './HeaderNavigation.module.scss';

interface HeaderNavigationProps {
  onDropdownOpen: (dropdownType: string) => void;
  onDropdownClose: () => void;
}

export const HeaderNavigation: React.FC<HeaderNavigationProps> = ({
  onDropdownOpen,
  onDropdownClose
}) => {
  return (
    <div className={styles.navigation}>
      <Logo />
      
      <HeaderMenu 
        onDropdownOpen={onDropdownOpen}
        onDropdownClose={onDropdownClose}
      />
    </div>
  );
};
