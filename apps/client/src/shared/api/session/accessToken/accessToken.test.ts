import { beforeEach, describe, expect, it } from 'vitest';

import { clearAccessToken, getAccessToken, setAccessToken } from './accessToken';

describe('accessToken', () => {
  beforeEach(() => {
    clearAccessToken();
  });

  it('starts as null', () => {
    expect(getAccessToken()).toBeNull();
  });

  it('set/get/clear', () => {
    setAccessToken('tok');
    expect(getAccessToken()).toBe('tok');
    clearAccessToken();
    expect(getAccessToken()).toBeNull();
  });
});
