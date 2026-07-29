import { beforeEach, describe, expect, it, vi } from 'vitest';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

import { listUsers, setUserRole } from './usersApi';

vi.mock('@/shared/api', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    default: {
      get: vi.fn(),
      patch: vi.fn(),
    },
  };
});

const apiMock = apiClient as unknown as {
  get: ReturnType<typeof vi.fn>;
  patch: ReturnType<typeof vi.fn>;
};

describe('usersApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('listUsers passes pagination params', async () => {
    const page = { items: [], total: 0, page: 1, perPage: 50, hasMore: false };
    apiMock.get.mockResolvedValue({ data: page });

    await expect(listUsers({ page: 1 })).resolves.toEqual(page);
    expect(apiMock.get).toHaveBeenCalledWith(API_ENDPOINTS.ADMIN.USERS.LIST, {
      params: { page: 1 },
    });
  });

  it('setUserRole patches role by user id', async () => {
    const updated = {
      id: 2,
      email: 'user@example.com',
      role: 'ADMIN',
      roles: [{ id: 1, value: 'ADMIN' }],
    };
    apiMock.patch.mockResolvedValue({ data: updated });

    await expect(setUserRole(2, { role: 'ADMIN' })).resolves.toEqual(updated);
    expect(apiMock.patch).toHaveBeenCalledWith(API_ENDPOINTS.ADMIN.USERS.BY_ID(2), {
      role: 'ADMIN',
    });
  });
});
