import { describe, expect, it } from 'vitest';

import { resolveAuthReturnUrl } from './resolveAuthReturnUrl';

describe('resolveAuthReturnUrl', () => {
  it('defaults to /films', () => {
    expect(resolveAuthReturnUrl(null)).toBe('/films');
    expect(resolveAuthReturnUrl(undefined)).toBe('/films');
    expect(resolveAuthReturnUrl('')).toBe('/films');
  });

  it('accepts relative same-origin paths', () => {
    expect(resolveAuthReturnUrl('/films/12')).toBe('/films/12');
    expect(resolveAuthReturnUrl('/films/12?tab=reviews')).toBe('/films/12?tab=reviews');
  });

  it('rejects open redirects', () => {
    expect(resolveAuthReturnUrl('//evil.com')).toBe('/films');
    expect(resolveAuthReturnUrl('https://evil.com')).toBe('/films');
    expect(resolveAuthReturnUrl('/\\evil.com')).toBe('/films');
    expect(resolveAuthReturnUrl('/auth/login')).toBe('/films');
  });
});
