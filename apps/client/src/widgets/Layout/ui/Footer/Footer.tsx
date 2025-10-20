'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, SvgIcon } from '@/shared/ui';
import { FimsSearch } from '@/features/films/search';
import styles from './Footer.module.scss';

export const Footer = () => {
  const router = useRouter();
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handlePhoneToggle = () => {
    setShowPhoneNumber(!showPhoneNumber);
  };

  const handleSearchToggle = () => {
    setIsSearchOpen(true);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
  };

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const openUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.container}>
          {/* Основной контент футера */}
          <div className={styles.content}>
            {/* Колонка "Разделы" */}
            <div className={styles.column}>
              <h3 className={styles.heading}>Разделы</h3>
              <ul className={styles.list}>
                <li className={styles.item}>
                  <button
                    className={styles.link}
                    onClick={() => navigateTo('/films')}
                  >
                    Что нового
                  </button>
                </li>
                <li className={styles.item}>
                  <button
                    className={styles.link}
                    onClick={() => navigateTo('/films')}
                  >
                    Фильмы
                  </button>
                </li>
                <li className={styles.item}>
                  <button
                    className={styles.link}
                    onClick={() => navigateTo('/films?genre=мультфильм')}
                  >
                    Мультфильмы
                  </button>
                </li>
                <li className={styles.item}>
                  <button
                    className={styles.link}
                    onClick={() => navigateTo('/films?genre=мультфильм')}
                  >
                    Что посмотреть
                  </button>
                </li>
              </ul>
              <div className={styles.certificateLinkWrapper}>
                <Link
                  href="https://www.ivi.ru/cert"
                  className={styles.certificateLink}
                >
                  Movie Land Platform
                </Link>
              </div>
            </div>

            {/* Колонка "Поддержка" */}
            <div className={styles.column}>
              <h3 className={styles.heading}>Поддержка</h3>
              <p className={styles.text}>Мы всегда готовы вам помочь.</p>
              <p className={styles.text}>Обращайтесь в любое время!</p>
            </div>

            {/* Колонка с кнопкой подписки */}
            <Link className={styles.column} href="https://www.ivi.ru/subscribe">
              <div className={styles.bigButton}>
                <SvgIcon name="mute" size={56} />
              </div>
              <p className={`${styles.text} ${styles.textBigButton}`}>
                Смотрите фильмы, сериалы и мультфильмы без рекламы
              </p>
            </Link>
          </div>

          {/* Вторая строка контента */}
          <div className={styles.content}>
            <div className={`${styles.column} ${styles.columnWide}`}>
              <div className={styles.copyrights}>
                <p className={styles.textCopyrights}>
                  <span>©&nbsp;</span>
                  <span>2025</span>
                  <span>&nbsp;Онлайн-кинотеатр</span>
                </p>
                <p className={`${styles.text} ${styles.textCopyrights}`}>
                  HBO ® and related service marks are the property of Home Box
                  Office, Inc
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Мобильная версия */}
        <div className={styles.mobile}>
          <div className={styles.mobileContainer}>
            <div className={styles.copyrightsMobile}>
              <p className={styles.mobileText}>
                HBO ® and related service marks are the property of Home Box
                Office, Inc
              </p>
            </div>
          </div>
          <div className={styles.bottomBar}>
            <ul className={styles.mobileList}>
              <li
                className={styles.mobileItem}
                onClick={() => navigateTo('/films')}
              >
                <SvgIcon name="home" size={20} />
                <h5 className={styles.mobileHeading}>MovieLand</h5>
              </li>
              <li
                className={styles.mobileItem}
                onClick={() => navigateTo('/films')}
              >
                <SvgIcon name="devices" size={20} />
                <h5 className={styles.mobileHeading}>Каталог</h5>
              </li>
              <li className={styles.mobileItem}>
                <div className={styles.search} onClick={handleSearchToggle}>
                  <SvgIcon name="search" size={20} />
                  <h5 className={styles.mobileHeading}>Поиск</h5>
                </div>
              </li>
              <li
                className={styles.mobileItem}
                onClick={() => openUrl('https://www.ivi.ru/series')}
              >
                <SvgIcon name="tv" size={20} />
                <h5 className={styles.mobileHeading}>TV+</h5>
              </li>
              <li
                className={styles.mobileItem}
                onClick={() => openUrl('https://www.ivi.ru/')}
              >
                <div className={styles.svgBlock}>
                  <SvgIcon name="circle-flooded" size={5} />
                  <SvgIcon
                    name="circle-flooded"
                    size={5}
                    className={styles.svgCircleCenter}
                  />
                  <SvgIcon name="circle-flooded" size={5} />
                </div>
                <h5 className={styles.mobileHeading}>Ещё</h5>
              </li>
            </ul>
          </div>
        </div>
      </footer>

      {/* Компонент поиска */}
      <FimsSearch isOpen={isSearchOpen} handleClose={handleSearchClose} />
    </>
  );
};
