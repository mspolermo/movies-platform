import Link from "next/link"

import { HeaderDropdown } from "@/features/openHeaderDropdown"

import { THeaderMenuItem } from "../../../models"
import styles from './HeaderMenuItem.module.scss';
import { QickFiltersList } from "./QickFiltersList";
import { ChaptersSection } from "./ChaptersSection";

type THeaderMenuItemProps = {
  item: THeaderMenuItem,
  onDropdownOpenChange: (isOpen: boolean) => void
}

/**
 * Рендерит пункт меню хедера.
 * Если у пункта есть dropdown-контент — подключает HeaderDropdown.
 */
export const HeaderMenuItem = ({item, onDropdownOpenChange}: THeaderMenuItemProps) => {
  const {label, url, content} = item

  if (content === 'qickFiltersList') return (
    <HeaderDropdown
      onOpenChange={onDropdownOpenChange}
      trigger={({ onOpen }) => (
        <Link
          href={url}
          className={styles.menuLink}
          onMouseEnter={onOpen}
        >
          {label}
        </Link>
      )}
      content={({ onClose }) => (
        <QickFiltersList onClose={onClose} />
      )}
    />
  )

  if (content === 'chaptersSection') return (
    <HeaderDropdown
    onOpenChange={onDropdownOpenChange}
    trigger={({ onOpen }) => (
      <Link
        href={url}
        className={styles.menuLink}
        onMouseEnter={onOpen}
      >
        {label}
      </Link>
    )}
    content={() => <ChaptersSection/>}
  />
  )
  
  return (
    <Link
      href={url}
      className={styles.menuLink}
    >
      {label}
    </Link>
  )
}