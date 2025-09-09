import { IconsBlockProps } from "../types"
import styles from './FilmCard.module.scss';
import { Tooltip, SvgIcon } from '@/shared/ui';
import { 
  BookmarkIcon, 
  BookmarkFilledIcon, 
  RefreshIcon, 
  StarIcon, 
  CloseIcon 
} from '@/shared/assets/svg-icons';

export const IconsBlock = (props: IconsBlockProps) => {
  const { 
    notLike, 
    isFavorite,
    handleFavoritesClick,
    handleSimilarClick,
    handleGradeClick,
    handleNotLikeClick
  } = props;

  
  return (
    <div className={styles.icons}>
        <Tooltip content="Добавить в избранное" position="top">
          <div className={styles.iconStyle}>
            <SvgIcon
              icon={isFavorite ? BookmarkFilledIcon : BookmarkIcon}
              size={25.8}
              className={styles.iconSvg}
              data-variant="bookmark"
              data-active={isFavorite}
              onClick={handleFavoritesClick}
              aria-label="Добавить в избранное"
            />
          </div>
        </Tooltip>

        <Tooltip content="Похожие фильмы" position="top">
          <div className={styles.iconStyle}>
            <SvgIcon
              icon={RefreshIcon}
              size={20.8}
              className={styles.iconSvg}
              data-variant="refresh"
              onClick={handleSimilarClick}
              aria-label="Похожие фильмы"
            />
          </div>
        </Tooltip>

        <Tooltip content="Оценить фильм" position="top">
          <div className={styles.iconStyle}>
            <SvgIcon
              icon={StarIcon}
              size={25.8}
              className={styles.iconSvg}
              data-variant="star"
              onClick={handleGradeClick}
              aria-label="Оценить фильм"
            />
          </div>
        </Tooltip>

        <Tooltip content="Не нравится" position="top">
          <div className={styles.iconStyle}>
            <SvgIcon
              icon={CloseIcon}
              size={20.8}
              className={styles.iconSvg}
              data-variant="close"
              data-active={notLike}
              onClick={handleNotLikeClick}
              aria-label="Не нравится"
            />
          </div>
        </Tooltip>
  </div>
  )
}