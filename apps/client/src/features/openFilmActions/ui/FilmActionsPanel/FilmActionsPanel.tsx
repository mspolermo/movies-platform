'use client';

import type { TFilmActionsPanelProps } from './types';

import type { MouseEvent } from 'react';

import cn from 'classnames';
import { useState } from 'react';

import { useFilmActions, resolveFilmPosterUrl } from '@/entities/film';
import { BookmarkFilledIcon, BookmarkIcon, RateIcon, ShareIcon } from '@/shared/assets';
import { debugStubLog } from '@/shared/lib';
import { SvgIcon, Tooltip } from '@/shared/ui';

import styles from './FilmActionsPanel.module.scss';

const ICON_SIZE = 22;

/**
 * Панель действий фильма: card (overlay icons) | detail (strip).
 */
export const FilmActionsPanel = (props: TFilmActionsPanelProps) => {
  const { variant, film } = props;
  const actions = useFilmActions();
  const [isFavorite, setIsFavorite] = useState(false);

  if (!actions) {
    debugStubLog('[openFilmActions] FilmActionsPanel rendered without FilmActionsProvider');
    return null;
  }

  const title = film.filmNameRu || film.filmNameEn || 'Без названия';
  const posterUrl = resolveFilmPosterUrl(film, 'small');
  const favoriteLabel = isFavorite ? 'Убрать из избранного' : 'Добавить в избранное';

  const handleFavorite = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    setIsFavorite((prev) => {
      const next = !prev;
      debugStubLog(
        next
          ? `[openFilmActions] favorite added: ${film.id}`
          : `[openFilmActions] favorite removed: ${film.id}`
      );
      return next;
    });
  };

  const handleRate = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    actions.openGradeFilm(film.id);
  };

  const handleShare = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    actions.openShareFilm({
      id: film.id,
      title,
      year: film.year,
      movieLength: film.movieLength,
      posterUrl,
    });
  };

  if (variant === 'card') {
    return (
      <>
        <Tooltip content={favoriteLabel} position="top">
          <button
            aria-label={favoriteLabel}
            aria-pressed={isFavorite}
            className={styles.iconButton}
            type="button"
            onClick={handleFavorite}
          >
            <SvgIcon
              className={cn(styles.iconSvg, isFavorite ? styles.iconActive : styles.iconDefault)}
              icon={isFavorite ? BookmarkFilledIcon : BookmarkIcon}
              size={ICON_SIZE}
            />
          </button>
        </Tooltip>

        <Tooltip content="Оценить фильм" position="top">
          <button
            aria-label="Оценить фильм"
            className={styles.iconButton}
            type="button"
            onClick={handleRate}
          >
            <SvgIcon
              className={cn(styles.iconSvg, styles.iconDefault)}
              icon={RateIcon}
              size={ICON_SIZE}
            />
          </button>
        </Tooltip>

        <Tooltip content="Поделиться" position="top">
          <button
            aria-label="Поделиться"
            className={styles.iconButton}
            type="button"
            onClick={handleShare}
          >
            <SvgIcon
              className={cn(styles.iconSvg, styles.iconDefault)}
              icon={ShareIcon}
              size={ICON_SIZE}
            />
          </button>
        </Tooltip>
      </>
    );
  }

  return (
    <div aria-label="Действия с фильмом" className={styles.detail}>
      <button
        aria-label={favoriteLabel}
        aria-pressed={isFavorite}
        className={cn(styles.detailAction, isFavorite && styles.detailActionActive)}
        type="button"
        onClick={handleFavorite}
      >
        <SvgIcon
          className={styles.detailIcon}
          icon={isFavorite ? BookmarkFilledIcon : BookmarkIcon}
          size={ICON_SIZE}
        />
        <span className={styles.detailLabel}>{isFavorite ? 'В избранном' : 'Избранное'}</span>
      </button>

      <button
        aria-label="Оценить фильм"
        className={styles.detailAction}
        type="button"
        onClick={handleRate}
      >
        <SvgIcon className={styles.detailIcon} icon={RateIcon} size={ICON_SIZE} />
        <span className={styles.detailLabel}>Оценить</span>
      </button>

      <button
        aria-label="Поделиться"
        className={styles.detailAction}
        type="button"
        onClick={handleShare}
      >
        <SvgIcon className={styles.detailIcon} icon={ShareIcon} size={ICON_SIZE} />
        <span className={styles.detailLabel}>Поделиться</span>
      </button>
    </div>
  );
};
