'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { CURRENT_YEAR } from '@/shared/constants';
import { SvgIcon } from '@/shared/ui';

import styles from './styles/LaptopFooter.module.scss';
import { FOOTER_SECTIONS_LAPTOP } from '../../constants';

export const LaptopFooter = () => {
  const pathname = usePathname();

  return (
    <footer className={styles.footer}>
      {/* Верхняя строка */}
      <div className={styles.row}>
        <div className={styles.columnsWrapper}>
          {/* Разделы */}
          <nav className={styles.column}>
            <h3 className={styles.heading}>Разделы</h3>

            <ul className={styles.list}>
              {FOOTER_SECTIONS_LAPTOP.map(({ label, url }) => (
                <li key={url}>
                  <Link
                    aria-current={pathname === url ? 'page' : undefined}
                    aria-label={label}
                    className={styles.link}
                    href={url}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <Link className={styles.brand} href={'/'}>
              MovieLand Platform
            </Link>
          </nav>

          {/* Поддержка */}
          <div className={styles.column}>
            <h3 className={styles.heading}>Поддержка</h3>

            <p className={styles.text}>Мы всегда готовы вам помочь.</p>

            <p className={styles.text}>Обращайтесь в любое время!</p>
          </div>

          {/* CTA */}
          <Link className={styles.column} href="/">
            <div className={styles.bigButton}>
              <SvgIcon aria-hidden name="mute" size={56} />
            </div>

            <p className={styles.ctaText}>
              Смотрите фильмы, сериалы и мультфильмы без рекламы
            </p>
          </Link>
        </div>
      </div>

      {/* Нижняя строка */}
      <div className={styles.row}>
        <div className={styles.copyright}>
          <p>© {CURRENT_YEAR} Онлайн-кинотеатр</p>
          <p>
            HBO ® and related service marks are the property of Home Box
            Office, Inc
          </p>
        </div>
      </div>
    </footer>
  );
};
