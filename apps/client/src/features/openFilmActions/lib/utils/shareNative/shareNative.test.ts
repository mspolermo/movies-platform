import { afterEach, describe, expect, it, vi } from 'vitest';

import { canShareNative, shareNative } from './shareNative';

describe('canShareNative / shareNative', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('detects missing navigator.share', () => {
    vi.stubGlobal('navigator', {});
    expect(canShareNative()).toBe(false);
  });

  it('returns unavailable when share is missing', async () => {
    vi.stubGlobal('navigator', {});
    await expect(shareNative({ title: 't', url: 'https://x' })).resolves.toBe('unavailable');
  });

  it('returns shared on success', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { share });

    await expect(shareNative({ title: 'Film', url: 'https://x/films/1' })).resolves.toBe('shared');
    expect(share).toHaveBeenCalledWith({ title: 'Film', url: 'https://x/films/1' });
  });

  it('swallows AbortError', async () => {
    const share = vi.fn().mockRejectedValue(new DOMException('Aborted', 'AbortError'));
    vi.stubGlobal('navigator', { share });

    await expect(shareNative({ title: 'Film', url: 'https://x' })).resolves.toBe('aborted');
  });

  it('returns failed on other errors', async () => {
    const share = vi.fn().mockRejectedValue(new Error('boom'));
    vi.stubGlobal('navigator', { share });

    await expect(shareNative({ title: 'Film', url: 'https://x' })).resolves.toBe('failed');
  });
});
