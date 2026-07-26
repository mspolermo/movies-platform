import { afterEach, describe, expect, it, vi } from 'vitest';

import { buildFilmShareUrl } from './buildFilmShareUrl';

describe('buildFilmShareUrl', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns absolute url in browser', () => {
    vi.stubGlobal('window', {
      location: { origin: 'https://example.com' },
    });

    expect(buildFilmShareUrl(42)).toBe('https://example.com/films/42');
  });
});
