import type { THeaderMenuItem } from '../../../models';

import Link from 'next/link';

import { HeaderDropdown } from '@/features/openHeaderDropdown';

import { ChaptersSection } from './ChaptersSection';
import styles from './HeaderMenuItem.module.scss';
import { QickFiltersList } from './QickFiltersList';

type THeaderMenuItemProps = {
  item: THeaderMenuItem;
  onDropdownOpenChange: (isOpen: boolean) => void;
};

/**
 * Рендерит пункт меню хедера.
 * Если у пункта есть dropdown-контент — подключает HeaderDropdown.
 */
export const HeaderMenuItem = ({
  item,
  onDropdownOpenChange,
}: THeaderMenuItemProps) => {
  const { label, url, content } = item;

  if (content === 'qickFiltersList')
    return (
      <HeaderDropdown
        content={({ onClose }) => <QickFiltersList onClose={onClose} />}
        trigger={({ onOpen }) => (
          <Link className={styles.menuLink} href={url} onMouseEnter={onOpen}>
            {label}
          </Link>
        )}
        onOpenChange={onDropdownOpenChange}
      />
    );

  if (content === 'chaptersSection')
    return (
      <HeaderDropdown
        content={() => <ChaptersSection />}
        trigger={({ onOpen }) => (
          <Link className={styles.menuLink} href={url} onMouseEnter={onOpen}>
            {label}
          </Link>
        )}
        onOpenChange={onDropdownOpenChange}
      />
    );

  return (
    <Link className={styles.menuLink} href={url}>
      {label}
    </Link>
  );
};
