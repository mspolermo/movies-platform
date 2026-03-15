'use client';

import styles from './styles/Dropdown.module.scss';
import { Loader } from '@/shared/ui';
import cn from 'classnames';
import { DropdownHeader } from './DropdownHeader';
import { DropdownItem } from './DropdownItem';
import { useDropdownList } from '../../../lib';

interface TDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

//TODO: сломалась удержания открытия по наведение на открытый дропдаун

export const Dropdown = ({
  isOpen,
  onClose
}: TDropdownProps) => {

  const items = useDropdownList(onClose);

  return (
    <div
      className={cn(styles.dropdown, {
        [styles.open]: isOpen
      })}
      onMouseLeave={onClose}
    >
      <div className={styles.content}>

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
      </div>
    </div>
  );
};