import type { IconsBlockProps } from '../types';

import {
  BookmarkIcon,
  BookmarkFilledIcon,
  RefreshIcon,
  StarIcon,
  CloseIcon,
} from '@/shared/assets';
import { Tooltip, SvgIcon } from '@/shared/ui';

import styles from './FilmCard.module.scss';

export const IconsBlock = (props: IconsBlockProps) => {
  const {
    notLike,
    isFavorite,
    handleFavoritesClick,
    handleSimilarClick,
    handleGradeClick,
    handleNotLikeClick,
  } = props;

  return (
    <>
      <Tooltip content="Добавить в избранное" position="top">
        <button
          aria-label={
            isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'
          }
          aria-pressed={isFavorite}
          className={styles.iconButton}
          onClick={handleFavoritesClick}
        >
          <SvgIcon
            className={`${styles.iconSvg} ${isFavorite ? styles.iconActive : styles.iconDefault}`}
            icon={isFavorite ? BookmarkFilledIcon : BookmarkIcon}
            size={25.8}
          />
        </button>
      </Tooltip>

      <Tooltip content="Похожие фильмы" position="top">
        <button
          aria-label="Показать похожие фильмы"
          className={styles.iconButton}
          onClick={handleSimilarClick}
        >
          <SvgIcon
            className={`${styles.iconSvg} ${styles.iconDefault}`}
            icon={RefreshIcon}
            size={20.8}
          />
        </button>
      </Tooltip>

      <Tooltip content="Оценить фильм" position="top">
        <button
          aria-label="Оценить фильм"
          className={styles.iconButton}
          onClick={handleGradeClick}
        >
          <SvgIcon
            className={`${styles.iconSvg} ${styles.iconDefault}`}
            icon={StarIcon}
            size={25.8}
          />
        </button>
      </Tooltip>

      <Tooltip content="Не нравится" position="top">
        <button
          aria-label={notLike ? 'Убрать из непонравившихся' : 'Не нравится'}
          aria-pressed={notLike}
          className={styles.iconButton}
          onClick={handleNotLikeClick}
        >
          <SvgIcon
            className={`${styles.iconSvg} ${notLike ? styles.iconActive : styles.iconDefault}`}
            icon={CloseIcon}
            size={20.8}
          />
        </button>
      </Tooltip>
    </>
  );
};
