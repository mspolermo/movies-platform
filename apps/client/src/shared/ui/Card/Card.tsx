'use client';

import React, { useEffect, useState } from 'react';

import styles from './Card.module.scss';
import { RemotePoster } from '../RemotePoster';

//TODO: выпилить БЭМ

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

  //TODO: юс эффекты на стили? что за бред? полностью переделать
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

  return (
    <div className={cardClass} onClick={onClick}>
      <div className={bodyClass}>
        <RemotePoster
          alt={title ?? ''}
          className={imgClass}
          fallbackClassName={styles.imageError}
          fallbackIconSize={24}
          fallbackLabel=""
          size="s"
          skeletonBorderRadius="inherit"
          src={photoUrl}
        />
      </div>
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
