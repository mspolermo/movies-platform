'use client';

import {
  cloneElement,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import styles from './HeaderDropdown.module.scss';
import { TDropdownProps } from './types';


/**
 * UI-компонент с логикой Dropdown для Header.
 *
 * Возможности:
 * - открытие по hover
 * - задержка закрытия (чтобы избежать случайных закрытий)
 * - возможность закрыть dropdown изнутри через `onClose`
 */
export const HeaderDropdown = ({ trigger, children, onOpenChange }: TDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  /** Таймер используется для плавного закрытия */
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Открывает dropdown и отменяет закрытие */
  const handleOpen = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsOpen(true);
  };

  /** Закрывает dropdown с небольшой задержкой */
  const handleClose = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  /** Отменяет закрытие при возврате курсора */
  const cancelClose = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  /** Уведомляем родителя об изменении состояния открытия */
  useEffect(() => {
    if (!onOpenChange) {
      return;
    }

    onOpenChange(isOpen);
    // onOpenChange считается стабильным извне, поэтому не включаем его в зависимости
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <div
      className={styles.container}
      onMouseLeave={handleClose}
      onMouseEnter={cancelClose}
    >
      {/* Триггер (ссылка / кнопка меню) */}
      {trigger({
        onOpen: handleOpen,
        onClose: handleClose,
        isOpen,
      })}

      {/* Dropdown */}
      <div
        className={cn(styles.dropdown, {
          [styles.open]: isOpen,
        })}
      >
        <div className={styles.content}>
          {/* 
            Прокидываем onClose внутрь children,
            чтобы элементы внутри dropdown могли закрыть его.
          */}
          {cloneElement(children, { onClose: handleClose })}
        </div>
      </div>
    </div>
  );
};