import { afterEach, describe, expect, it, vi } from 'vitest';

import { buildLoginHref } from './buildLoginHref';

describe('buildLoginHref', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('builds login href with encoded pathname+search as returnUrl', () => {
    vi.stubGlobal('window', {
      location: {
        pathname: '/films/12',
        search: '?tab=reviews',
      },
    });

    expect(buildLoginHref()).toBe(
      `/auth/login?returnUrl=${encodeURIComponent('/films/12?tab=reviews')}`
    );
  });

  it('encodes special characters in returnUrl', () => {
    vi.stubGlobal('window', {
      location: {
        pathname: '/films',
        search: '?q=a&b=1',
      },
    });

    expect(buildLoginHref()).toBe(`/auth/login?returnUrl=${encodeURIComponent('/films?q=a&b=1')}`);
  });
});
