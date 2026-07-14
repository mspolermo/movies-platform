'use client';

import { useEffect, useState } from 'react';

import { useAuth } from '@/entities/user';
import { applyAuthResponse, logout } from '@/features/auth';
import {
  getAccessToken,
  getApiBaseUrl,
  getCurrentUser,
  hasSessionCookie,
  refreshSession,
} from '@/shared/api';
import { Button } from '@/shared/ui';
import { Page } from '@/widgets/Layout';

import styles from './DebugPage.module.scss';

type TJwtDebugPayload = {
  sub?: number;
  email?: string;
  iat?: number;
  exp?: number;
};

const formatUnix = (unix?: number): string => {
  if (!unix) {
    return '—';
  }

  return `${new Date(unix * 1000).toLocaleString('ru-RU')} (${unix})`;
};

const decodeJwtPayload = (token: string): TJwtDebugPayload | null => {
  try {
    const [, payload] = token.split('.');

    if (!payload) {
      return null;
    }

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(normalized);

    return JSON.parse(json) as TJwtDebugPayload;
  } catch {
    return null;
  }
};

const maskToken = (token: string | null): string => {
  if (!token) {
    return 'null';
  }

  if (token.length <= 24) {
    return `${token.slice(0, 8)}…`;
  }

  return `${token.slice(0, 12)}…${token.slice(-8)} (len=${token.length})`;
};

const statusBadgeClass = (status: string): string => {
  if (status === 'authenticated') {
    return styles.badgeOk;
  }

  if (status === 'loading' || status === 'idle') {
    return styles.badgeWarn;
  }

  return styles.badgeErr;
};

export const DebugPage = () => {
  const { user, status, isAuthenticated, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [tick, setTick] = useState(0);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionBusy, setActionBusy] = useState(false);
  const [mePreview, setMePreview] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // tick — чтобы перечитать module-scoped access token / cookie без стора
  useEffect(() => {
    if (!mounted) {
      return;
    }

    const id = window.setInterval(() => setTick((n) => n + 1), 1000);
    return () => window.clearInterval(id);
  }, [mounted]);

  // Cookie / memory / Date — только после mount, иначе hydration mismatch
  const accessToken = mounted ? getAccessToken() : null;
  const jwtPayload = accessToken ? decodeJwtPayload(accessToken) : null;
  const hasSession = mounted ? hasSessionCookie() : null;
  const apiBaseUrl = mounted ? getApiBaseUrl() : '…';
  const nowSec = mounted ? Math.floor(Date.now() / 1000) : 0;
  const expiresInSec = jwtPayload?.exp ? jwtPayload.exp - nowSec : null;

  void tick;

  const handleRefresh = async () => {
    setActionError(null);
    setActionBusy(true);

    try {
      const response = await refreshSession();
      applyAuthResponse(response);
      setTick((n) => n + 1);
    } catch {
      setActionError('refresh failed');
    } finally {
      setActionBusy(false);
    }
  };

  const handleMe = async () => {
    setActionError(null);
    setActionBusy(true);

    try {
      const me = await getCurrentUser();
      setMePreview(JSON.stringify(me, null, 2));
    } catch {
      setActionError('GET /auth/me failed');
      setMePreview(null);
    } finally {
      setActionBusy(false);
    }
  };

  const handleLogout = async () => {
    setActionError(null);
    setActionBusy(true);

    try {
      await logout();
      setMePreview(null);
      setTick((n) => n + 1);
    } catch {
      setActionError('logout failed');
    } finally {
      setActionBusy(false);
    }
  };

  return (
    <Page title="Debug / Auth">
      <div className={styles.root}>
        <section className={styles.section}>
          <h2 className={styles.title}>Session</h2>
          <div className={styles.row}>
            <span className={styles.label}>status</span>
            <span className={styles.value}>
              <span className={`${styles.badge} ${statusBadgeClass(status)}`}>{status}</span>
              {' · '}
              isAuthenticated={String(isAuthenticated)} · isLoading={String(isLoading)}
            </span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>has_session</span>
            <span className={styles.value}>
              {hasSession === null ? (
                <span className={styles.hint}>…</span>
              ) : (
                <>
                  <span
                    className={`${styles.badge} ${hasSession ? styles.badgeOk : styles.badgeErr}`}
                  >
                    {hasSession ? 'yes' : 'no'}
                  </span>
                  <span className={styles.hint}> UX-cookie, не security</span>
                </>
              )}
            </span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>accessToken</span>
            <span className={styles.value}>{mounted ? maskToken(accessToken) : '…'}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>apiBaseUrl</span>
            <span className={styles.value}>{apiBaseUrl}</span>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.title}>User (zustand)</h2>
          {user ? (
            <>
              <div className={styles.row}>
                <span className={styles.label}>id</span>
                <span className={styles.value}>{user.id}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>email</span>
                <span className={styles.value}>{user.email}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>name</span>
                <span className={styles.value}>{user.name ?? '—'}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>roles</span>
                <span className={styles.value}>
                  {user.roles.map((role) => role.value).join(', ') || '—'}
                </span>
              </div>
            </>
          ) : (
            <p className={styles.hint}>user = null</p>
          )}
        </section>

        <section className={styles.section}>
          <h2 className={styles.title}>JWT payload (decoded, client-side)</h2>
          {!mounted ? (
            <p className={styles.hint}>…</p>
          ) : jwtPayload ? (
            <>
              <div className={styles.row}>
                <span className={styles.label}>sub</span>
                <span className={styles.value}>{jwtPayload.sub ?? '—'}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>email</span>
                <span className={styles.value}>{jwtPayload.email ?? '—'}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>iat</span>
                <span className={styles.value}>{formatUnix(jwtPayload.iat)}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>exp</span>
                <span className={styles.value}>
                  {formatUnix(jwtPayload.exp)}
                  {expiresInSec !== null && (
                    <>
                      {' · '}
                      <span
                        className={`${styles.badge} ${
                          expiresInSec > 0 ? styles.badgeOk : styles.badgeErr
                        }`}
                      >
                        {expiresInSec > 0 ? `${expiresInSec}s left` : 'expired'}
                      </span>
                    </>
                  )}
                </span>
              </div>
            </>
          ) : (
            <p className={styles.hint}>нет access token в памяти</p>
          )}
        </section>

        <section className={styles.section}>
          <h2 className={styles.title}>Actions</h2>
          <div className={styles.actions}>
            <Button disabled={actionBusy} type="button" variant="red" onClick={handleRefresh}>
              POST /auth/refresh
            </Button>
            <Button disabled={actionBusy} type="button" variant="red" onClick={handleMe}>
              GET /auth/me
            </Button>
            <Button disabled={actionBusy} type="button" variant="red" onClick={handleLogout}>
              Logout
            </Button>
            <Button type="button" variant="red" onClick={() => window.location.reload()}>
              Reload page
            </Button>
          </div>
          {actionError && <p className={styles.error}>{actionError}</p>}
          {mePreview && (
            <pre className={styles.value} style={{ marginTop: '1rem' }}>
              {mePreview}
            </pre>
          )}
          <p className={styles.hint}>
            refreshToken в HttpOnly cookie не читается JS — только косвенно через refresh /
            has_session.
          </p>
        </section>
      </div>
    </Page>
  );
};
