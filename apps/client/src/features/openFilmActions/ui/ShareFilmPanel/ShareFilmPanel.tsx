'use client';

import type { TShareFilmPanelProps } from './types';

import cn from 'classnames';
import { useEffect, useState } from 'react';

import { formatDuration } from '@/entities/film';
import { RemotePoster, SvgIcon } from '@/shared/ui';

import styles from './ShareFilmPanel.module.scss';
import { buildFilmShareUrl, canShareNative, copyText, shareNative } from '../../lib';

type TCopyState = 'idle' | 'copied' | 'failed';
type TShareState = 'idle' | 'failed';

/**
 * Контент модалки шаринга: meta фильма + copy link + native share.
 */
export const ShareFilmPanel = ({ payload }: TShareFilmPanelProps) => {
  const { id, title, year, movieLength, posterUrl } = payload;
  const [copyState, setCopyState] = useState<TCopyState>('idle');
  const [shareState, setShareState] = useState<TShareState>('idle');
  const [nativeAvailable, setNativeAvailable] = useState(false);

  const url = buildFilmShareUrl(id);
  const duration = movieLength ? formatDuration(movieLength) : null;
  const metaParts = [year, duration].filter(Boolean);

  useEffect(() => {
    setNativeAvailable(canShareNative());
  }, []);

  useEffect(() => {
    if (copyState === 'idle') {
      return;
    }

    const timer = window.setTimeout(() => setCopyState('idle'), 2000);
    return () => window.clearTimeout(timer);
  }, [copyState]);

  useEffect(() => {
    if (shareState === 'idle') {
      return;
    }

    const timer = window.setTimeout(() => setShareState('idle'), 2000);
    return () => window.clearTimeout(timer);
  }, [shareState]);

  const handleCopy = async () => {
    const ok = await copyText(url);
    setCopyState(ok ? 'copied' : 'failed');
  };

  const handleNativeShare = async () => {
    const result = await shareNative({
      title,
      text: title,
      url,
    });

    if (result === 'failed') {
      setShareState('failed');
    }
  };

  const copyTitle =
    copyState === 'copied'
      ? 'Скопировано'
      : copyState === 'failed'
        ? 'Не удалось скопировать'
        : 'Скопировать ссылку';

  const copyAriaLabel =
    copyState === 'copied'
      ? 'Ссылка скопирована'
      : copyState === 'failed'
        ? 'Не удалось скопировать ссылку'
        : 'Скопировать ссылку';

  const shareTitle = shareState === 'failed' ? 'Не удалось поделиться' : 'Поделиться…';
  const shareAriaLabel =
    shareState === 'failed' ? 'Не удалось поделиться' : 'Поделиться через систему';

  const statusMessage =
    copyState === 'copied'
      ? 'Ссылка скопирована'
      : copyState === 'failed'
        ? 'Не удалось скопировать ссылку'
        : shareState === 'failed'
          ? 'Не удалось поделиться'
          : '';

  return (
    <div className={styles.root}>
      <div aria-live="polite" className={styles.status}>
        {statusMessage}
      </div>

      <div className={styles.head}>
        {posterUrl ? (
          <RemotePoster
            alt={title}
            className={styles.poster}
            imageClassName={styles.posterImage}
            size="s"
            src={posterUrl}
          />
        ) : (
          <div aria-hidden className={styles.posterPlaceholder} />
        )}
        <div className={styles.meta}>
          <h3 className={styles.filmTitle}>{title}</h3>
          {metaParts.length > 0 && (
            <p className={styles.subtitle}>
              {metaParts.map((part, index) => (
                <span key={`${part}-${index}`} className={styles.subtitlePart}>
                  {index > 0 && <span aria-hidden className={styles.dot} />}
                  {part}
                </span>
              ))}
            </p>
          )}
        </div>
      </div>

      <div className={styles.body}>
        <button
          aria-label={copyAriaLabel}
          className={cn(
            styles.row,
            styles.rowSolo,
            copyState === 'copied' && styles.rowSuccess,
            copyState === 'failed' && styles.rowError
          )}
          type="button"
          onClick={handleCopy}
        >
          <span className={styles.rowText}>
            <span className={styles.rowTitle}>{copyTitle}</span>
            <span className={styles.rowHint}>{url}</span>
          </span>
          <SvgIcon className={styles.rowIcon} icon="copy" size={20} />
        </button>

        {nativeAvailable && (
          <button
            aria-label={shareAriaLabel}
            className={cn(styles.row, styles.rowSolo, shareState === 'failed' && styles.rowError)}
            type="button"
            onClick={handleNativeShare}
          >
            <span className={styles.rowText}>
              <span className={styles.rowTitle}>{shareTitle}</span>
              <span className={styles.rowHint}>Через приложения устройства</span>
            </span>
            <SvgIcon className={styles.rowIcon} icon="share" size={20} />
          </button>
        )}
      </div>
    </div>
  );
};
