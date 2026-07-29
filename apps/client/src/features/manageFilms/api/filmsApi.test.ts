import { AxiosError, AxiosHeaders } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

import { createFilm, deleteFilm, getFilmById, listFilms, updateFilm } from './filmsApi';

vi.mock('@/shared/api', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    default: {
      get: vi.fn(),
      post: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
    },
  };
});

const apiMock = apiClient as unknown as {
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
  patch: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
};

const makeAxios404 = () =>
  new AxiosError('Request failed', '404', undefined, undefined, {
    status: 404,
    statusText: 'Not Found',
    headers: {},
    config: { headers: new AxiosHeaders() },
    data: { message: 'Фильм не найден' },
  });

describe('filmsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('listFilms passes pagination and q as params', async () => {
    const page = { items: [], total: 0, page: 1, perPage: 50, hasMore: false };
    apiMock.get.mockResolvedValue({ data: page });

    await expect(listFilms({ page: 2, q: 'матриц' })).resolves.toEqual(page);
    expect(apiMock.get).toHaveBeenCalledWith(API_ENDPOINTS.ADMIN.FILMS.LIST, {
      params: { page: 2, q: 'матриц' },
    });
  });

  it('getFilmById returns data', async () => {
    apiMock.get.mockResolvedValue({ data: { id: 1, filmNameRu: 'Матрица' } });

    await expect(getFilmById(1)).resolves.toMatchObject({ filmNameRu: 'Матрица' });
    expect(apiMock.get).toHaveBeenCalledWith(API_ENDPOINTS.ADMIN.FILMS.BY_ID(1));
  });

  it('getFilmById maps 404 to null', async () => {
    apiMock.get.mockRejectedValue(makeAxios404());

    await expect(getFilmById(99999)).resolves.toBeNull();
  });

  it('getFilmById rethrows non-404 errors', async () => {
    apiMock.get.mockRejectedValue(new Error('network'));

    await expect(getFilmById(1)).rejects.toThrow('network');
  });

  it('createFilm posts payload', async () => {
    apiMock.post.mockResolvedValue({ data: { id: 3, filmNameRu: 'Тест' } });

    await expect(createFilm({ filmNameRu: 'Тест' })).resolves.toMatchObject({ id: 3 });
    expect(apiMock.post).toHaveBeenCalledWith(API_ENDPOINTS.ADMIN.FILMS.LIST, {
      filmNameRu: 'Тест',
    });
  });

  it('updateFilm patches payload with null-clearing', async () => {
    apiMock.patch.mockResolvedValue({ data: { id: 1, filmNameRu: 'Матрица' } });

    await expect(updateFilm(1, { description: null })).resolves.toMatchObject({ id: 1 });
    expect(apiMock.patch).toHaveBeenCalledWith(API_ENDPOINTS.ADMIN.FILMS.BY_ID(1), {
      description: null,
    });
  });

  it('deleteFilm calls DELETE by id', async () => {
    apiMock.delete.mockResolvedValue({ data: true });

    await expect(deleteFilm(1)).resolves.toBeUndefined();
    expect(apiMock.delete).toHaveBeenCalledWith(API_ENDPOINTS.ADMIN.FILMS.BY_ID(1));
  });
});
