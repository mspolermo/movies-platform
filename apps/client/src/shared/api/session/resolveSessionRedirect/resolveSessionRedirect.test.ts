import { describe, expect, it } from 'vitest';

import { config as proxyConfig } from '../../../../../proxy';
import {
  AUTH_LOGIN_PATH,
  DEFAULT_POST_AUTH_PATH,
  SESSION_AUTH_PATHS,
  SESSION_PROTECTED_PREFIXES,
} from '../constants';
import { resolveSessionRedirect } from './resolveSessionRedirect';

describe('resolveSessionRedirect', () => {
  it('redirects guest from protected path to login with returnUrl', () => {
    expect(resolveSessionRedirect({ pathname: '/profile', hasSession: false })).toBe(
      `${AUTH_LOGIN_PATH}?returnUrl=${encodeURIComponent('/profile')}`
    );
    expect(
      resolveSessionRedirect({
        pathname: '/profile/settings',
        search: '?tab=1',
        hasSession: false,
      })
    ).toBe(`${AUTH_LOGIN_PATH}?returnUrl=${encodeURIComponent('/profile/settings?tab=1')}`);
  });

  it('redirects guest from /admin to login with returnUrl', () => {
    expect(resolveSessionRedirect({ pathname: '/admin', hasSession: false })).toBe(
      `${AUTH_LOGIN_PATH}?returnUrl=${encodeURIComponent('/admin')}`
    );
    expect(
      resolveSessionRedirect({
        pathname: '/admin/films',
        search: '?q=1',
        hasSession: false,
      })
    ).toBe(`${AUTH_LOGIN_PATH}?returnUrl=${encodeURIComponent('/admin/films?q=1')}`);
  });

  it('does not treat /administration as protected', () => {
    expect(resolveSessionRedirect({ pathname: '/administration', hasSession: false })).toBeNull();
  });

  it('redirects session user away from auth pages', () => {
    expect(resolveSessionRedirect({ pathname: '/auth/login', hasSession: true })).toBe(
      DEFAULT_POST_AUTH_PATH
    );
    expect(resolveSessionRedirect({ pathname: '/auth/register', hasSession: true })).toBe(
      DEFAULT_POST_AUTH_PATH
    );
  });

  it('returns null when no UX redirect needed', () => {
    expect(resolveSessionRedirect({ pathname: '/films', hasSession: false })).toBeNull();
    expect(resolveSessionRedirect({ pathname: '/films', hasSession: true })).toBeNull();
    expect(resolveSessionRedirect({ pathname: '/profile', hasSession: true })).toBeNull();
    expect(resolveSessionRedirect({ pathname: '/auth/login', hasSession: false })).toBeNull();
  });

  it('keeps proxy matcher in sync with SESSION_* constants', () => {
    const matcher = proxyConfig.matcher;

    for (const path of SESSION_AUTH_PATHS) {
      expect(matcher).toContain(path);
    }

    for (const prefix of SESSION_PROTECTED_PREFIXES) {
      expect(matcher.some((entry) => entry.startsWith(prefix))).toBe(true);
    }
  });
});
