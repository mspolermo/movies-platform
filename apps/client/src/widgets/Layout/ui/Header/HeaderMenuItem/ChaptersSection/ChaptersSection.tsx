import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { FOOTER_SECTIONS_LAPTOP } from '@/widgets/Layout/constants';

import styles from './ChaptersSection.module.scss';

export const ChaptersSection = () => {
  const pathname = usePathname();
  return (
    <div className={styles.grid}>
      <h3 className={styles.heading}>Разделы</h3>
      {FOOTER_SECTIONS_LAPTOP.map(({ label, url }) => (
        <Link
          key={label}
          aria-current={pathname === url ? 'page' : undefined}
          aria-label={label}
          className={styles.item}
          href={url}
        >
          {label}
        </Link>
      ))}
    </div>
  );
};
