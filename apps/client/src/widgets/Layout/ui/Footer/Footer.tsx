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
      <div className={styles.footer} data-testid="footer">
        <div className={styles.container}>
          {/* Основной контент футера */}
          <div className={styles.content}>
            {/* Колонка "О нас" */}
            <div className={styles.column}>
              <h3 className={styles.heading}>О нас</h3>
              <ul className={styles.list}>
                <li className={styles.item}>
                  <Link href="https://corp.ivi.ru/" className={styles.link}>
                    <p className={styles.text}>О компании</p>
                  </Link>
                </li>
                <li className={styles.item}>
                  <Link href="https://corp.ivi.ru/career/#career-vacancy-block" className={styles.link}>
                    Вакансии
                  </Link>
                </li>
                <li className={styles.item}>
                  <Link href="https://www.ivi.ru/pages/beta" className={styles.link}>
                    Бета-тестирование
                  </Link>
                </li>
                <li className={styles.item}>
                  <Link href="https://www.ivi.ru/info/partners" className={styles.link}>
                    Партнёрам
                  </Link>
                </li>
                <li className={styles.item}>
                  <Link href="https://corp.ivi.ru/advertisers/" className={styles.link}>
                    Размещение рекламы
                  </Link>
                </li>
                <li className={styles.item}>
                  <Link href="https://www.ivi.ru/info/agreement" className={styles.link}>
                    Пользовательское соглашение
                  </Link>
                </li>
                <li className={styles.item}>
                  <Link href="https://www.ivi.ru/info/confidential" className={styles.link}>
                    Политика конфиденциальности
                  </Link>
                </li>
                <li className={styles.item}>
                  <Link href="https://www.ivi.ru/info/goryachaya-liniya-komplaens" className={styles.link}>
                    Комплаенс
                  </Link>
                </li>
              </ul>
            </div>

            {/* Колонка "Разделы" */}
            <div className={styles.column}>
              <h3 className={styles.heading}>Разделы</h3>
              <ul className={styles.list}>
                <li className={styles.item}>
                  <button 
                    className={styles.link}
                    onClick={() => navigateTo('/films')}
                  >
                    Мой Иви
                  </button>
                </li>
                <li className={styles.item}>
                  <Link href="https://www.ivi.ru/new" className={styles.link}>
                    Что нового
                  </Link>
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
                  <Link href="https://www.ivi.ru/series" className={styles.link}>
                    Сериалы
                  </Link>
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
                  <Link href="https://www.ivi.ru/tvplus" className={styles.link}>
                    TV+
                  </Link>
                </li>
                <li className={styles.item}>
                  <Link href="https://www.ivi.ru/goodmovies" className={styles.link}>
                    Что посмотреть
                  </Link>
                </li>
              </ul>
              <div className={styles.certificateLinkWrapper}>
                <Link href="https://www.ivi.ru/cert" className={styles.certificateLink}>
                  Активация сертификата
                </Link>
              </div>
            </div>

            {/* Колонка "Поддержка" */}
            <div className={styles.column}>
              <h3 className={styles.heading}>Поддержка</h3>
              <p className={styles.text}>Мы всегда готовы вам помочь.</p>
              <p className={styles.text}>Обращайтесь в любое время!</p>
              
              <div className={styles.buttons}>
                <Button 
                  title="Онлайн-чат"
                  onClick={() => openUrl('https://www.ivi.ru/profile')}
                />
              </div>
              
              <div className={styles.buttons}>
                <Button 
                  icon={<SvgIcon name="mail" size={20} />}
                  onClick={() => openUrl('mailto:support@ivi.ru')}
                />
                <Button 
                  icon={<SvgIcon name="phone" size={20} />}
                  onClick={handlePhoneToggle}
                />
              </div>
              
              <div className={`${styles.buttons} ${!showPhoneNumber ? styles.buttonsHidden : ''}`}>
                <Button 
                  title="+7 343 226-92-20"
                  onClick={() => openUrl('tel:+73432269220')}
                />
              </div>
              
              <div className={`${styles.ask} ${showPhoneNumber ? styles.askHidden : ''}`}>
                <Link href="https://ask.ivi.ru/" className={styles.link}>
                  <p className={`${styles.text} ${styles.textAdditional}`}>ask.ivi.ru</p>
                </Link>
                <p className={styles.text}>Ответы на вопросы</p>
              </div>
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
              <div className={styles.stores}>
                <Button 
                  icon={<SvgIcon name="apple" size={20} />}
                  title="Загрузить в App Store"
                  onClick={() => openUrl('https://apps.apple.com/RU/app/id455705533?mt=8')}
                />
                <Button
                  icon={<SvgIcon name="google" size={20} />}
                  title="Доступно в Google Play"
                  onClick={() => openUrl('https://play.google.com/store/apps/details?id=ru.ivi.client')}
                />
                <Button 
                  icon={<SvgIcon name="smartTV" size={20} />}
                  title="Смотрите на Smart TV"
                  onClick={() => openUrl('https://www.ivi.tv/pages/tvsmart/')}
                />
                <Button 
                  icon={<SvgIcon name="devices" size={22} />}
                  title="Все устройства"
                  onClick={() => openUrl('https://www.ivi.tv/devices')}
                />
              </div>
              <div className={styles.copyrights}>
                <p className={styles.textCopyrights}>
                  <span>©&nbsp;</span>
                  <span>2023</span>
                  <span>&nbsp;Иви. Онлайн-кинотеатр</span>
                </p>
                <p className={`${styles.text} ${styles.textCopyrights}`}>
                  HBO ® and related service marks are the property of Home Box Office, Inc
                </p>
              </div>
            </div>
            
            <div className={`${styles.column} ${styles.columnWide}`}>
              <div className={styles.community}>
                <Link className={styles.communityLink} href="https://vk.com/iviru?crc=fa4448c13e06e69ba9e814e8743c7e2e" target="_blank" rel="noreferrer">
                  <div className={styles.iconBlock}>
                    <SvgIcon className={styles.icon} name="vkontakte" size={20} />
                  </div>
                </Link>
                <Link className={styles.communityLink} href="https://ok.ru/ivi.ru" target="_blank" rel="noreferrer">
                  <div className={styles.iconBlock}>
                    <SvgIcon className={styles.icon} name="odnoklasniki" size={20} />
                  </div>
                </Link>
                <Link className={styles.communityLink} href="https://twitter.com/ivi_ru" target="_blank" rel="noreferrer">
                  <div className={styles.iconBlock}>
                    <SvgIcon className={styles.icon} name="twitter" size={20} />
                  </div>
                </Link>
                <Link className={styles.communityLink} href="https://vb.me/a0544c" target="_blank" rel="noreferrer">
                  <div className={styles.iconBlock}>
                    <SvgIcon className={styles.icon} name="viber" size={20} />
                  </div>
                </Link>
                <Link className={styles.communityLink} href="https://www.linkedin.com/company/2543415/" target="_blank" rel="noreferrer">
                  <div className={styles.iconBlock}>
                    <SvgIcon className={styles.icon} name="linkedin" size={20} />
                  </div>
                </Link>
                <Link className={styles.communityLink} href="https://t.me/official_iviru" target="_blank" rel="noreferrer">
                  <div className={styles.iconBlock}>
                    <SvgIcon className={styles.icon} name="telegram" size={20} />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Мобильная версия */}
        <div className={styles.mobile}>
          <div className={styles.mobileContainer}>
            <div className={styles.copyrightsMobile}>
              <p className={styles.mobileText}>
                HBO ® and related service marks are the property of Home Box Office, Inc
              </p>
            </div>
          </div>
          <div className={styles.bottomBar}>
            <ul className={styles.mobileList}>
              <li className={styles.mobileItem} onClick={() => navigateTo('/films')}>
                <SvgIcon name="home" size={20} />
                <h5 className={styles.mobileHeading}>Мой Иви</h5>
              </li>
              <li className={styles.mobileItem} onClick={() => navigateTo('/films')}>
                <SvgIcon name="devices" size={20} />
                <h5 className={styles.mobileHeading}>Каталог</h5>
              </li>
              <li className={styles.mobileItem}>
                <div className={styles.search} onClick={handleSearchToggle}>
                  <SvgIcon name="search" size={20} />
                  <h5 className={styles.mobileHeading}>Поиск</h5>
                </div>
              </li>
              <li className={styles.mobileItem} onClick={() => openUrl('https://www.ivi.ru/series')}>
                <SvgIcon name="tv" size={20} />
                <h5 className={styles.mobileHeading}>TV+</h5>
              </li>
              <li className={styles.mobileItem} onClick={() => openUrl('https://www.ivi.ru/')}>
                <div className={styles.svgBlock}>
                  <SvgIcon name="circle-flooded" size={5} />
                  <SvgIcon name="circle-flooded" size={5} className={styles.svgCircleCenter} />
                  <SvgIcon name="circle-flooded" size={5} />
                </div>
                <h5 className={styles.mobileHeading}>Ещё</h5>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Компонент поиска */}
      <FimsSearch isOpen={isSearchOpen} handleClose={handleSearchClose} />
    </>
  );
};
