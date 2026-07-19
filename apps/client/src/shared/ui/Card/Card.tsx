'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import { shouldSkipImageOptimization } from '@/shared/lib';

import styles from './Card.module.scss';
import { SvgIcon } from '../SvgIcon';

interface CardProps {
  type?: 'small' | 'big';
  title?: string;
  photoUrl?: string;
  role?: string;
  onClick?: () => void;
}

export const Card = ({ type = 'small', title, photoUrl, role, onClick }: CardProps) => {
  const [cardClass, setCardClass] = useState(styles.card);
  const [imgClass, setImgClass] = useState(styles.card__img);
  const [bodyClass, setBodyClass] = useState(styles.card__body);
  const [textClass, setTextClass] = useState(styles.card__text);
  const [titleArray, setTitleArray] = useState(['']);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Сбрасываем состояние загрузки при изменении photoUrl
    if (photoUrl) {
      setImageLoading(true);
      setImageError(false);
    } else {
      setImageLoading(false);
      setImageError(true);
    }
  }, [photoUrl]);

  useEffect(() => {
    switch (type) {
      case 'small':
        setCardClass(styles.card__small);
        setBodyClass(styles.card__body_small);
        setImgClass(styles.card__img_small);
        setTextClass(styles.card__text_small);
        break;
      case 'big':
        setCardClass(styles.card__big);
        setBodyClass(styles.card__body_big);
        setImgClass(styles.card__img_big);
        if (title) {
          setTitleArray(title.split(' '));
        }
        break;
    }
  }, [type, title]);

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const renderImageContent = () => {
    // Если нет URL - показываем ошибку
    if (!photoUrl || imageError) {
      return (
        <div className={styles.imageError}>
          <SvgIcon color="var(--color-text)" name="image-icon" size={24} />
        </div>
      );
    }

    return (
      <>
        <div className={imgClass} style={{ position: 'relative' }}>
          <Image
            fill
            alt={title ?? ''}
            sizes="(max-width: 768px) 100vw, 300px"
            src={photoUrl}
            style={{
              objectFit: 'cover',
              opacity: imageLoading ? 0 : 1,
              transition: 'opacity 0.3s ease',
            }}
            unoptimized={shouldSkipImageOptimization(photoUrl)}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        </div>
        {imageLoading && <div className={styles.skeleton}></div>}
      </>
    );
  };

  return (
    <div className={cardClass} onClick={onClick}>
      <div className={bodyClass}>{renderImageContent()}</div>
      <div>
        {title && !titleArray[1] && <p className={textClass}>{title}</p>}

        {titleArray.length === 2 && (
          <div>
            <p className={styles.card__text_big}>{titleArray[0]}</p>
            <p className={styles.card__text_big}>{titleArray[1]}</p>
          </div>
        )}
        {role && <p className={styles.card__text_role}>{role}</p>}
      </div>
    </div>
  );
};
