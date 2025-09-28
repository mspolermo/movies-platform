'use client';

import React, { useState, useEffect } from 'react';
import { SvgIcon } from '@/shared/ui/SvgIcon';
import { Input } from '@/shared/ui/Input';
import styles from './HeaderSearch.module.scss';

//TODO: переделать

export const HeaderSearch = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Закрытие по Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <div className={styles.search}>
      <button
        className={styles.button}
        onClick={handleToggle}
        data-testid="headerSearch"
      >
        <SvgIcon 
          name="search" 
          className={styles.icon}
          size={20}
        />
        <span className={styles.text}>Поиск</span>
      </button>
      
      {isOpen && (
        <div className={styles.overlay} onClick={handleClose}>
          <div className={styles.content} onClick={(e) => e.stopPropagation()}>
            <Input
              placeholder="Поиск фильмов, сериалов, мультфильмов..."
              className={styles.input}
              autoFocus
            />
            <button
              className={styles.close}
              onClick={handleClose}
            >
              <SvgIcon name="close" size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
