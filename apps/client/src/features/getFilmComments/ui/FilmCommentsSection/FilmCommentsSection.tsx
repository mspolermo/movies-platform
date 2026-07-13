'use client';

import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

import { CommentCard, CommentsEmptyState, toggleCommentLike } from '@/entities/comment';
import { hasToken } from '@/shared/lib/auth';
import { Button, LoadMoreSection, Skeleton } from '@/shared/ui';

import { CreateReviewForm } from './CreateReviewForm';
import styles from './FilmCommentsSection.module.scss';
import { useFilmComments } from '../../lib';

type TFilmCommentsSectionProps = {
  filmId: number;
  filmName: string;
};

//TODO: не слишком ли много логики в компоненте? не слишком ли сложно  сделано?

export const FilmCommentsSection = ({ filmId, filmName }: TFilmCommentsSectionProps) => {
  const router = useRouter();
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [likingCommentIds, setLikingCommentIds] = useState<Set<number>>(() => new Set());

  const likeRequestIdRef = useRef<Map<number, number>>(new Map());

  const { comments, total, loading, error, hasMore, loadMore, refetch, updateCommentLike } =
    useFilmComments({
      filmId,
    });

  const handleOpenReviewForm = () => {
    if (!hasToken()) {
      router.push('/auth/login');
      return;
    }

    setIsReviewFormOpen(true);
  };

  const handleLikeClick = async (commentId: number) => {
    if (!hasToken()) {
      router.push('/auth/login');
      return;
    }

    if (likingCommentIds.has(commentId)) {
      return;
    }

    const comment = comments.find((item) => item.id === commentId);

    if (!comment) {
      return;
    }

    const previousLiked = Boolean(comment.liked);
    const previousCount = comment.likesCount;
    const optimisticLiked = !previousLiked;
    const optimisticCount = optimisticLiked ? previousCount + 1 : Math.max(0, previousCount - 1);

    const requestId = (likeRequestIdRef.current.get(commentId) ?? 0) + 1;
    likeRequestIdRef.current.set(commentId, requestId);

    setLikingCommentIds((prev) => new Set(prev).add(commentId));
    updateCommentLike(commentId, optimisticCount, optimisticLiked);

    try {
      const result = await toggleCommentLike(commentId);

      if (likeRequestIdRef.current.get(commentId) !== requestId) {
        return;
      }

      updateCommentLike(commentId, result.likesCount, result.liked);
    } catch (err: unknown) {
      if (likeRequestIdRef.current.get(commentId) !== requestId) {
        return;
      }

      updateCommentLike(commentId, previousCount, previousLiked);

      if (isAxiosError(err) && err.response?.status === 401) {
        router.push('/auth/login');
      }
    } finally {
      if (likeRequestIdRef.current.get(commentId) === requestId) {
        setLikingCommentIds((prev) => {
          const next = new Set(prev);
          next.delete(commentId);
          return next;
        });
      }
    }
  };

  const handleCommentCreated = async () => {
    setIsReviewFormOpen(false);
    await refetch();
  };

  const initialLoading = loading && comments.length === 0;

  if (initialLoading) {
    return (
      <div className={styles.section}>
        <Skeleton height="32px" width="40%" />
        <Skeleton height="120px" />
        <Skeleton height="120px" />
      </div>
    );
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <LoadMoreSection
      hasMore={hasMore}
      isLoading={loading && comments.length > 0}
      onLoadMore={loadMore}
    >
      <section className={styles.section}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>
              Отзывы <span className={styles.count}>{total}</span>
            </h2>
            <p className={styles.subtitle}>о фильме «{filmName}»</p>
          </div>

          {!isReviewFormOpen && (
            <Button type="button" variant="outline" onClick={handleOpenReviewForm}>
              Оставить отзыв
            </Button>
          )}
        </div>

        {isReviewFormOpen && (
          <CreateReviewForm
            filmId={filmId}
            onCancel={() => setIsReviewFormOpen(false)}
            onSuccess={handleCommentCreated}
          />
        )}

        {comments.length === 0 ? (
          <CommentsEmptyState filmName={filmName} />
        ) : (
          <div className={styles.list}>
            {comments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                isLikePending={likingCommentIds.has(comment.id)}
                onLikeClick={handleLikeClick}
              />
            ))}
          </div>
        )}
      </section>
    </LoadMoreSection>
  );
};
