'use client';

import Link from 'next/link';
import { SvgIcon } from '@/shared/ui';
import styles from './styles/LaptopFooter.module.scss';
import { LAPTOP_SECTIONS } from '../../constants';
import { CURRENT_YEAR } from '@/shared/constants';
import { usePathname } from 'next/navigation';

export const LaptopFooter = () => {
  const pathname = usePathname();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        
        {/* Верхняя строка */}
        <div className={styles.row}>
          
          {/* Разделы */}
          <nav className={styles.column}>
            <h3 className={styles.heading}>Разделы</h3>

            <ul className={styles.list}>
              {LAPTOP_SECTIONS.map(({ label, url }) => (
                <li key={url}>
                  <Link
                    className={styles.link}
                    href={url}
                    aria-label={label}
                    aria-current={pathname === url ? 'page' : undefined}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              className={styles.brand}
              href={'/'}
            >
              MovieLand Platform
            </Link>
          </nav>

          {/* Поддержка */}
          <div className={styles.column}>
            <h3 className={styles.heading}>Поддержка</h3>

            <p className={styles.text}>
              Мы всегда готовы вам помочь.
            </p>

            <p className={styles.text}>
              Обращайтесь в любое время!
            </p>
          </div>

          {/* CTA */}
          <Link href="/" className={styles.column}>
            <div className={styles.bigButton}>
              <SvgIcon name="mute" size={56} aria-hidden/>
            </div>

            <p className={styles.ctaText}>
              Смотрите фильмы, сериалы и мультфильмы без рекламы
            </p>
          </Link>
        </div>

        {/* Нижняя строка */}
        <div className={styles.row}>
          <div className={styles.columnWide}>
            <div className={styles.copyright}>
              <p>© {CURRENT_YEAR} Онлайн-кинотеатр</p>
              <p>HBO ® and related service marks are the property of Home Box Office, Inc</p>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}