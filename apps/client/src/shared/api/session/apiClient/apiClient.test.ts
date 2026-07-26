import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockPost, mockRequestUse, mockResponseUse, mockRequest } = vi.hoisted(() => ({
  mockPost: vi.fn(),
  mockRequestUse: vi.fn(),
  mockResponseUse: vi.fn(),
  mockRequest: vi.fn(),
}));

vi.mock('axios', () => ({
  default: {
    create: () => {
      const client = Object.assign((config: unknown) => mockRequest(config), {
        post: mockPost,
        interceptors: {
          request: { use: mockRequestUse },
          response: { use: mockResponseUse },
        },
      });

      return client;
    },
  },
  isAxiosError: (error: unknown): error is { response?: { status?: number }; config?: unknown } =>
    typeof error === 'object' && error !== null && 'isAxiosError' in error,
}));

vi.mock('@/shared/lib', () => ({
  getApiBaseUrl: () => '/api',
}));

describe('apiClient session', () => {
  beforeEach(() => {
    vi.resetModules();
    mockPost.mockReset();
    mockRequest.mockReset();
    mockRequestUse.mockReset();
    mockResponseUse.mockReset();
    document.cookie = 'has_session=; Max-Age=0; Path=/';
  });

  it('single-flight: parallel calls share one request', async () => {
    let resolvePost!: (value: { data: unknown }) => void;
    mockPost.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePost = resolve;
        })
    );

    const { performTokenRefresh } = await import('./apiClient');
    const { clearAccessToken } = await import('../accessToken');
    const { setSessionBridge } = await import('../sessionBridge');

    clearAccessToken();
    setSessionBridge({
      onAuthenticated: vi.fn(),
      onUnauthenticated: vi.fn(),
    });

    const authResponse = {
      accessToken: 'new',
      user: { id: 1, email: 'a@b.c', name: undefined, roles: [] },
    };

    const first = performTokenRefresh();
    const second = performTokenRefresh();

    expect(mockPost).toHaveBeenCalledTimes(1);

    resolvePost({ data: authResponse });

    await expect(first).resolves.toEqual(authResponse);
    await expect(second).resolves.toEqual(authResponse);
  });

  it('401 after bootstrap replaced access retries without refresh', async () => {
    await import('./apiClient');
    const { setAccessToken, clearAccessToken } = await import('../accessToken');
    const { setSessionBridge } = await import('../sessionBridge');

    clearAccessToken();
    setAccessToken('fresh');
    setSessionBridge({
      onAuthenticated: vi.fn(),
      onUnauthenticated: vi.fn(),
      onSessionExpired: vi.fn(),
    });

    const onRejected = mockResponseUse.mock.calls[0]?.[1] as (error: unknown) => Promise<unknown>;
    mockRequest.mockResolvedValue({ data: 'ok' });

    const result = await onRejected({
      isAxiosError: true,
      response: { status: 401 },
      config: {
        url: '/films',
        headers: { Authorization: 'Bearer stale' },
      },
    });

    expect(mockPost).not.toHaveBeenCalled();
    expect(mockRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer fresh' }),
      })
    );
    expect(result).toEqual({ data: 'ok' });
  });

  it('401 with same expired access and session refreshes then retries', async () => {
    await import('./apiClient');
    const { setAccessToken, clearAccessToken } = await import('../accessToken');
    const { setSessionBridge } = await import('../sessionBridge');

    clearAccessToken();
    setAccessToken('expired');
    document.cookie = 'has_session=1; Path=/';

    setSessionBridge({
      onAuthenticated: vi.fn(),
      onUnauthenticated: vi.fn(),
      onSessionExpired: vi.fn(),
    });

    mockPost.mockResolvedValue({
      data: {
        accessToken: 'rotated',
        user: { id: 1, email: 'a@b.c', name: undefined, roles: [] },
      },
    });
    mockRequest.mockResolvedValue({ data: 'ok' });

    const onRejected = mockResponseUse.mock.calls[0]?.[1] as (error: unknown) => Promise<unknown>;

    const result = await onRejected({
      isAxiosError: true,
      response: { status: 401 },
      config: {
        url: '/films',
        headers: { Authorization: 'Bearer expired' },
      },
    });

    expect(mockPost).toHaveBeenCalledWith('/auth/refresh');
    expect(mockRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer rotated' }),
      })
    );
    expect(result).toEqual({ data: 'ok' });
  });

  it('401 without session after bootstrap notifies expired without refresh', async () => {
    await import('./apiClient');
    const { clearAccessToken } = await import('../accessToken');
    const { setSessionBridge } = await import('../sessionBridge');
    const { clearHasSessionCookie } = await import('../sessionCookie');

    clearAccessToken();
    clearHasSessionCookie();

    const onSessionExpired = vi.fn();
    setSessionBridge({
      onAuthenticated: vi.fn(),
      onUnauthenticated: vi.fn(),
      onSessionExpired,
    });

    const onRejected = mockResponseUse.mock.calls[0]?.[1] as (error: unknown) => Promise<unknown>;
    const error = {
      isAxiosError: true,
      response: { status: 401 },
      config: { url: '/films', headers: {} },
    };

    await expect(onRejected(error)).rejects.toBe(error);
    expect(mockPost).not.toHaveBeenCalled();
    expect(onSessionExpired).toHaveBeenCalledTimes(1);
  });

  it('401 on auth endpoint does not retry', async () => {
    await import('./apiClient');
    const onRejected = mockResponseUse.mock.calls[0]?.[1] as (error: unknown) => Promise<unknown>;

    const error = {
      isAxiosError: true,
      response: { status: 401 },
      config: { url: '/auth/login', headers: {} },
    };

    await expect(onRejected(error)).rejects.toBe(error);
    expect(mockPost).not.toHaveBeenCalled();
  });
});
