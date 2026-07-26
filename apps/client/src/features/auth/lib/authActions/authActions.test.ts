import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockSetAccessToken = vi.fn();
const mockClearAccessToken = vi.fn();
const mockClearHasSessionCookie = vi.fn();
const mockHasSessionCookie = vi.fn();
const mockLogoutUser = vi.fn();
const mockRefreshSession = vi.fn();
const mockRunSessionBootstrap = vi.fn((task: () => Promise<void>) => task());

vi.mock('@/shared/api', () => ({
  logoutUser: (...args: unknown[]) => mockLogoutUser(...args),
  refreshSession: (...args: unknown[]) => mockRefreshSession(...args),
}));

vi.mock('@/shared/api/session', () => ({
  setAccessToken: (...args: unknown[]) => mockSetAccessToken(...args),
  clearAccessToken: (...args: unknown[]) => mockClearAccessToken(...args),
  clearHasSessionCookie: (...args: unknown[]) => mockClearHasSessionCookie(...args),
  hasSessionCookie: (...args: unknown[]) => mockHasSessionCookie(...args),
  runSessionBootstrap: (task: () => Promise<void>) => mockRunSessionBootstrap(task),
}));

import { useUserStore } from '@/entities/user';

import { applyAuthResponse, bootstrapSession, logout } from './authActions';

describe('authActions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useUserStore.getState().reset();
    useUserStore.setState({ user: null, status: 'idle' });
  });

  it('applyAuthResponse writes token and store', () => {
    const response = {
      accessToken: 'access',
      user: { id: 1, email: 'u@e.c', name: undefined, roles: [] },
    };

    applyAuthResponse(response);

    expect(mockSetAccessToken).toHaveBeenCalledWith('access');
    expect(useUserStore.getState().user?.email).toBe('u@e.c');
    expect(useUserStore.getState().status).toBe('authenticated');
  });

  it('bootstrap without cookie → unauthenticated', async () => {
    mockHasSessionCookie.mockReturnValue(false);

    await bootstrapSession();

    expect(useUserStore.getState().status).toBe('unauthenticated');
    expect(mockRefreshSession).not.toHaveBeenCalled();
  });

  it('bootstrap with cookie refreshes via bridge path (not applyAuthResponse)', async () => {
    mockHasSessionCookie.mockReturnValue(true);
    const user = { id: 1, email: 'u@e.c', name: undefined, roles: [] };

    // performTokenRefresh → notifyAuthenticated (bridge); authActions сам store не трогает
    mockRefreshSession.mockImplementation(async () => {
      useUserStore.getState().setUser(user);
      useUserStore.getState().setStatus('authenticated');
      return { accessToken: 'x', user };
    });

    await bootstrapSession();

    expect(mockRefreshSession).toHaveBeenCalledTimes(1);
    expect(mockSetAccessToken).not.toHaveBeenCalled();
    expect(useUserStore.getState().status).toBe('authenticated');
    expect(useUserStore.getState().user?.email).toBe('u@e.c');
  });

  it('bootstrap refresh failure clears local session and calls logout', async () => {
    mockHasSessionCookie.mockReturnValue(true);
    mockRefreshSession.mockRejectedValue(new Error('refresh failed'));
    mockLogoutUser.mockResolvedValue(undefined);
    useUserStore.setState({
      user: { id: 1, email: 'u@e.c', name: undefined, roles: [] },
      status: 'idle',
    });

    await bootstrapSession();

    expect(mockClearAccessToken).toHaveBeenCalled();
    expect(mockClearHasSessionCookie).toHaveBeenCalled();
    expect(mockLogoutUser).toHaveBeenCalledTimes(1);
    expect(useUserStore.getState().user).toBeNull();
    expect(useUserStore.getState().status).toBe('unauthenticated');
  });

  it('logout clears local session even when API fails', async () => {
    mockLogoutUser.mockRejectedValue(new Error('network'));
    useUserStore.setState({
      user: { id: 1, email: 'u@e.c', name: undefined, roles: [] },
      status: 'authenticated',
    });

    await logout();

    expect(mockClearAccessToken).toHaveBeenCalled();
    expect(mockClearHasSessionCookie).toHaveBeenCalled();
    expect(useUserStore.getState().user).toBeNull();
    expect(useUserStore.getState().status).toBe('unauthenticated');
  });
});
