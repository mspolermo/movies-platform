import type { TCommentCardProps } from './types';

import cn from 'classnames';

import { SvgIcon } from '@/shared/ui';

import styles from './CommentCard.module.scss';
import { formatCommentDate } from '../../lib';

export const CommentCard = ({ comment, isLikePending = false, onLikeClick }: TCommentCardProps) => {
  const showTitle = Boolean(comment.title?.trim());

  const handleLikeClick = () => {
    onLikeClick?.(comment.id);
  };

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <span className={styles.authorName}>{comment.authorName}</span>
        <time className={styles.date}>{formatCommentDate(comment.createdAt)}</time>
      </div>

      <div className={styles.content}>
        {showTitle && <h3 className={styles.title}>{comment.title}</h3>}

        <p className={styles.text}>{comment.text}</p>
      </div>

      <div className={styles.actions}>
        <span className={styles.likesCount}>{comment.likesCount}</span>

        {onLikeClick && (
          <button
            aria-label="Нравится"
            aria-pressed={Boolean(comment.liked)}
            className={cn(styles.likeButton, comment.liked && styles.likeButtonActive)}
            disabled={isLikePending}
            type="button"
            onClick={handleLikeClick}
          >
            <SvgIcon icon="like" size={18} />
          </button>
        )}
      </div>
    </article>
  );
};
