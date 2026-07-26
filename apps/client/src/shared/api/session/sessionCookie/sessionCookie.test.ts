import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { HAS_SESSION_COOKIE, HAS_SESSION_VALUE } from '../constants';
import { clearHasSessionCookie, hasSessionCookie } from './sessionCookie';

describe('sessionCookie', () => {
  beforeEach(() => {
    document.cookie.split(';').forEach((cookie) => {
      const name = cookie.split('=')[0]?.trim();
      if (name) {
        document.cookie = `${name}=; Max-Age=0; Path=/`;
      }
    });
  });

  afterEach(() => {
    clearHasSessionCookie();
  });

  it('detects has_session cookie', () => {
    expect(hasSessionCookie()).toBe(false);
    document.cookie = `${HAS_SESSION_COOKIE}=${HAS_SESSION_VALUE}; Path=/`;
    expect(hasSessionCookie()).toBe(true);
  });

  it('clears has_session cookie', () => {
    document.cookie = `${HAS_SESSION_COOKIE}=${HAS_SESSION_VALUE}; Path=/`;
    clearHasSessionCookie();
    expect(hasSessionCookie()).toBe(false);
  });
});
