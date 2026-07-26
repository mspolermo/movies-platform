import { describe, expect, it } from 'vitest';

import { DEFAULT_POST_AUTH_PATH } from '@/shared/api/session';

import { resolveAuthReturnUrl } from './resolveAuthReturnUrl';

describe('resolveAuthReturnUrl', () => {
  it('defaults to DEFAULT_POST_AUTH_PATH', () => {
    expect(resolveAuthReturnUrl(null)).toBe(DEFAULT_POST_AUTH_PATH);
    expect(resolveAuthReturnUrl(undefined)).toBe(DEFAULT_POST_AUTH_PATH);
    expect(resolveAuthReturnUrl('')).toBe(DEFAULT_POST_AUTH_PATH);
  });

  it('accepts relative same-origin paths', () => {
    expect(resolveAuthReturnUrl('/films/12')).toBe('/films/12');
    expect(resolveAuthReturnUrl('/films/12?tab=reviews')).toBe('/films/12?tab=reviews');
  });

  it('rejects open redirects', () => {
    expect(resolveAuthReturnUrl('//evil.com')).toBe(DEFAULT_POST_AUTH_PATH);
    expect(resolveAuthReturnUrl('https://evil.com')).toBe(DEFAULT_POST_AUTH_PATH);
    expect(resolveAuthReturnUrl('/\\evil.com')).toBe(DEFAULT_POST_AUTH_PATH);
    expect(resolveAuthReturnUrl('/auth/login')).toBe(DEFAULT_POST_AUTH_PATH);
  });
});
