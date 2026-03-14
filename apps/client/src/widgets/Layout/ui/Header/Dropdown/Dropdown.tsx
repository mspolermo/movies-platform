'use client';

import styles from './styles/Dropdown.module.scss';
import { useDropdownData } from '../../../lib';
import { Loader } from '@/shared/ui';
import cn from 'classnames';
import { DropdownHeader } from './DropdownHeader';
import { DropdownItem } from './DropdownItem';

interface TDropdownProps {
  isClosing: boolean;
  onClose: () => void;
  onMouseEnter?: () => void;
}

export const Dropdown = ({
  isClosing,
  onClose,
  onMouseEnter,
}: TDropdownProps) => {

  const {
    items,
    isLoading
  } = useDropdownData(onClose);

  return (
    <div
      className={cn(styles.dropdown, {
        [styles.closing]: isClosing
      })}
      onMouseLeave={onClose}
      onMouseEnter={onMouseEnter}
    >
      <div className={styles.content}>
        {isLoading ? (
          <div className={styles.loaderWrapper}>
            <Loader />
          </div>
        ) : (
          <div className={styles.grid}>
            {items.map((item) =>
              item.type === 'heading' ? (
                <DropdownHeader key={`heading-${item.label}`} {...item} />
              ) : (
                <DropdownItem
                  {...item} 
                  key={`${item.label}-${item.key}`}
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};