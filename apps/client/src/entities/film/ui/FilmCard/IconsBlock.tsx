import { IconsBlockProps } from "../types"
import styles from './FilmCard.module.scss';
import { Tooltip } from '@/shared/ui';
import colors from '@/app/styles/colors.module.scss';

export const IconsBlock = (props: IconsBlockProps) => {
  const { showIcons, notLike, isFavorite, handleFavoritesClick, handleSimilarClick, handleGradeClick, handleNotLikeClick } = props;

  if (!showIcons) return null;
  
  return (
    <div className={styles.icons}>
        <Tooltip content="Добавить в избранное" position="top">
          <div 
            className={styles.iconStyle}
            onClick={handleFavoritesClick}
          >
            <svg 
              className={styles.iconSvg} 
              width="25.8" 
              height="25.8" 
              viewBox="0 0 20.8 20.8" 
              fill={isFavorite ? colors.redColor : 'none'}
              stroke={isFavorite ? colors.redColor : colors.textColor}
              strokeWidth="1"
            >
              {isFavorite ? (
                <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/>
              ) : (
                <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"/>
              )}
            </svg>
          </div>
        </Tooltip>

        <Tooltip content="Похожие фильмы" position="top">
          <div 
            className={styles.iconStyle}
            onClick={handleSimilarClick}
          >
            <svg 
              className={styles.iconSvg} 
              width="20.8" 
              height="20.8" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke={colors.textColor} 
              strokeWidth="1"
            >
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
              <path d="M3 21v-5h5"/>
            </svg>
          </div>
        </Tooltip>

        <Tooltip content="Оценить фильм" position="top">
          <div 
            className={styles.iconStyle}
            onClick={handleGradeClick}
          >
            <svg 
              className={styles.iconSvg} 
              width="25.8" 
              height="25.8" 
              viewBox="0 0 20.8 20.8" 
              fill="none" 
              stroke={colors.textColor} 
              strokeWidth="1"
            >
              <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
            </svg>
          </div>
        </Tooltip>

        <Tooltip content="Не нравится" position="top">
          <div 
            className={styles.iconStyle}
            onClick={handleNotLikeClick}
          >
            <svg 
              className={styles.iconSvg} 
              width="20.8" 
              height="20.8" 
              viewBox="0 0 22 22" 
              fill={notLike ? colors.redColor : 'none'}
              stroke={notLike ? colors.redColor : colors.textColor}
              strokeWidth="1"
            >
              <path d="M18 6L6 18"/>
              <path d="M6 6l12 12"/>
            </svg>
          </div>
        </Tooltip>
  </div>
  )
}