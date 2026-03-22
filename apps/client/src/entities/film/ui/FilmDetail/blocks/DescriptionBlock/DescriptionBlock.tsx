import type { DescriptionBlockProps } from '../../types';

import React, { useState, useEffect } from 'react';

import { QualityTag } from '@/shared/ui';

import styles from './DescriptionBlock.module.scss';

export const DescriptionBlock = ({
  description,
  filmNameRu,
  filmNameEn,
}: DescriptionBlockProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={styles.descriptionBlock}>
      <p className={`${styles.text} ${!isExpanded ? styles.short : ''}`}>
        {description}
      </p>

      {!isExpanded && (
        <p className={`${styles.text}`}>
          Приглашаем посмотреть «{filmNameRu ?? filmNameEn ?? ''}» в нашем
          кинотеатре
        </p>
      )}

      {!isExpanded && (
        <p
          className={`${styles.btn} ${isMobile ? styles.btnMobile : styles.btnDesktop}`}
          onClick={toggleExpanded}
        >
          {isMobile ? 'Читать' : 'Подробнее'}
        </p>
      )}

      {isExpanded && (
        <div className={styles.desktop}>
          <div className={styles.block}>
            <p className={styles.text}>Язык</p>
            <p className={`${styles.text} ${styles.textActive}`}>
              Русский, Английский
            </p>

            <p className={styles.text}>Субтитры</p>
            <p className={`${styles.text} ${styles.textActive}`}>
              Русский, Английский
            </p>

            <p className={styles.text}>
              <span>Изображение </span>
              <span className={styles.textGray}>информация</span>
            </p>

            <div className={styles.icons}>
              <QualityTag quality="FullHD" />
              <QualityTag quality="HD" />
              <QualityTag quality="1080" />
              <QualityTag quality="720" />
            </div>
          </div>

          <p className={styles.btn} onClick={toggleExpanded}>
            Свернуть
          </p>
        </div>
      )}
    </div>
  );
};
