'use client';

import type { TFilmActionsPanelProps } from './types';

import type { MouseEvent } from 'react';

import cn from 'classnames';

import {
  useFilmActions,
  useFilmFavorite,
  useFilmMyRating,
  resolveFilmPosterUrl,
} from '@/entities/film';
import { debugStubLog } from '@/shared/lib';
import { SvgIcon, Tooltip } from '@/shared/ui';

import styles from './FilmActionsPanel.module.scss';

const ICON_SIZE = 22;
/** sync FILM_USER_GRADE_BAD_MAX (@common/constants) */
const BAD_GRADE_MAX = 6;

/**
 * Панель действий фильма: card (overlay icons) | detail (strip).
 */
export const FilmActionsPanel = (props: TFilmActionsPanelProps) => {
  const { variant, film } = props;
  const actions = useFilmActions();
  const favoriteApi = useFilmFavorite();
  const ratingApi = useFilmMyRating();

  if (!actions) {
    debugStubLog('[openFilmActions] FilmActionsPanel rendered without FilmActionsProvider');
    return null;
  }

  const title = film.filmNameRu || film.filmNameEn || 'Без названия';
  const posterUrl = resolveFilmPosterUrl(film, 'small');
  const panelError = favoriteApi?.error ?? ratingApi?.error ?? null;

  const favoriteReady = favoriteApi?.isReady ?? false;
  const favoritePending = favoriteApi?.isPending(film.id) ?? false;
  // Hydrate fail: кнопка кликабельна → retry; in-flight — disabled.
  const favoriteDisabled =
    !favoriteApi || favoritePending || (!favoriteReady && !favoriteApi.error);
  const isFavorite = favoriteReady && (favoriteApi?.isFavorite(film.id) ?? false);
  const favoriteLabel = favoritePending
    ? 'Сохранение…'
    : isFavorite
      ? 'Убрать из избранного'
      : 'Добавить в избранное';

  const ratingReady = ratingApi?.isReady ?? false;
  // Hydrate fail: клик → retry в openGradeFilm; иначе ждём ready.
  const ratingDisabled = !ratingApi || (!ratingReady && ratingApi.error == null);
  const grade = ratingReady && ratingApi ? ratingApi.getGrade(film.id) : null;
  const hasGrade = grade != null;
  const rateLabel = hasGrade ? `Изменить оценку: ${grade}` : 'Оценить фильм';
  const rateDetailLabel = hasGrade ? 'Изменить' : 'Оценить';
  const rateIcon = hasGrade && grade <= BAD_GRADE_MAX ? 'rateDown' : 'rate';
  const rateToneClass = !hasGrade
    ? styles.iconDefault
    : grade <= BAD_GRADE_MAX
      ? styles.iconRateBad
      : styles.iconRateGood;

  const handleFavorite = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    void favoriteApi?.toggleFavorite(film.id);
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
            aria-busy={favoritePending || undefined}
            aria-label={favoriteLabel}
            aria-pressed={isFavorite}
            className={styles.iconButton}
            disabled={favoriteDisabled}
            type="button"
            onClick={handleFavorite}
          >
            <SvgIcon
              className={cn(styles.iconSvg, isFavorite ? styles.iconActive : styles.iconDefault)}
              icon={isFavorite ? 'bookmarkFilled' : 'bookmark'}
              size={ICON_SIZE}
            />
          </button>
        </Tooltip>

        <Tooltip content={rateLabel} position="top">
          <button
            aria-label={rateLabel}
            className={styles.iconButton}
            disabled={ratingDisabled}
            type="button"
            onClick={handleRate}
          >
            <SvgIcon
              className={cn(styles.iconSvg, rateToneClass)}
              icon={rateIcon}
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
              icon="share"
              size={ICON_SIZE}
            />
          </button>
        </Tooltip>

        {panelError ? (
          <span aria-live="polite" className={styles.srOnly} role="status">
            {panelError}
          </span>
        ) : null}
      </>
    );
  }

  return (
    <div className={styles.detailWrap}>
      <div aria-label="Действия с фильмом" className={styles.detail}>
        <button
          aria-busy={favoritePending || undefined}
          aria-label={favoriteLabel}
          aria-pressed={isFavorite}
          className={cn(styles.detailAction, isFavorite && styles.detailActionActive)}
          disabled={favoriteDisabled}
          type="button"
          onClick={handleFavorite}
        >
          <SvgIcon
            className={styles.detailIcon}
            icon={isFavorite ? 'bookmarkFilled' : 'bookmark'}
            size={ICON_SIZE}
          />
          <span className={styles.detailLabel}>{isFavorite ? 'В избранном' : 'Избранное'}</span>
        </button>

        <button
          aria-label={rateLabel}
          className={cn(
            styles.detailAction,
            hasGrade &&
              (grade <= BAD_GRADE_MAX ? styles.detailActionRateBad : styles.detailActionRateGood)
          )}
          disabled={ratingDisabled}
          type="button"
          onClick={handleRate}
        >
          <SvgIcon className={styles.detailIcon} icon={rateIcon} size={ICON_SIZE} />
          <span className={styles.detailLabel}>{rateDetailLabel}</span>
        </button>

        <button
          aria-label="Поделиться"
          className={styles.detailAction}
          type="button"
          onClick={handleShare}
        >
          <SvgIcon className={styles.detailIcon} icon="share" size={ICON_SIZE} />
          <span className={styles.detailLabel}>Поделиться</span>
        </button>
      </div>

      {panelError ? (
        <p aria-live="polite" className={styles.favoriteError} role="status">
          {panelError}
        </p>
      ) : null}
    </div>
  );
};
