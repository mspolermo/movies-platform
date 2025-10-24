import { IconsBlockProps } from '../types';
import styles from './FilmCard.module.scss';
import { Tooltip, SvgIcon } from '@/shared/ui';
import {
  BookmarkIcon,
  BookmarkFilledIcon,
  RefreshIcon,
  StarIcon,
  CloseIcon,
} from '@/shared/assets/svg-icons';

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
          className={styles.iconButton}
          onClick={handleFavoritesClick}
          aria-label={isFavorite ? "Убрать из избранного" : "Добавить в избранное"}
          aria-pressed={isFavorite}
        >
          <SvgIcon
            icon={isFavorite ? BookmarkFilledIcon : BookmarkIcon}
            size={25.8}
            className={`${styles.iconSvg} ${isFavorite ? styles.iconActive : styles.iconDefault}`}
          />
        </button>
      </Tooltip>

      <Tooltip content="Похожие фильмы" position="top">
        <button 
          className={styles.iconButton}
          onClick={handleSimilarClick}
          aria-label="Показать похожие фильмы"
        >
          <SvgIcon
            icon={RefreshIcon}
            size={20.8}
            className={`${styles.iconSvg} ${styles.iconDefault}`}
          />
        </button>
      </Tooltip>

      <Tooltip content="Оценить фильм" position="top">
        <button 
          className={styles.iconButton}
          onClick={handleGradeClick}
          aria-label="Оценить фильм"
        >
          <SvgIcon
            icon={StarIcon}
            size={25.8}
            className={`${styles.iconSvg} ${styles.iconDefault}`}
          />
        </button>
      </Tooltip>

      <Tooltip content="Не нравится" position="top">
        <button 
          className={styles.iconButton}
          onClick={handleNotLikeClick}
          aria-label={notLike ? "Убрать из непонравившихся" : "Не нравится"}
          aria-pressed={notLike}
        >
          <SvgIcon
            icon={CloseIcon}
            size={20.8}
            className={`${styles.iconSvg} ${notLike ? styles.iconActive : styles.iconDefault}`}
          />
        </button>
      </Tooltip>
    </>
  );
};
