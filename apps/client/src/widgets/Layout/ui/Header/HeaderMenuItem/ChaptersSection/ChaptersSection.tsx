import { FOOTER_SECTIONS_LAPTOP } from '@/widgets/Layout/constants';
import styles from './ChaptersSection.module.scss';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const ChaptersSection = () => {
  const pathname = usePathname();
  return (
    <div className={styles.grid}>
      <h3 className={styles.heading}>Разделы</h3>
        {FOOTER_SECTIONS_LAPTOP.map(({ label, url }) => (
            <Link
              key={label}
              className={styles.item}
              href={url}
              aria-label={label}
              aria-current={pathname === url ? 'page' : undefined}
            >
              {label}
            </Link>
        ))}
    </div>
  )
};