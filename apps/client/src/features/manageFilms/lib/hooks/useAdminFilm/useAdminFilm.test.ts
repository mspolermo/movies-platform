import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAdminFilm } from './useAdminFilm';
import { getFilmById } from '../../../api';

vi.mock('../../../api', () => ({
  getFilmById: vi.fn(),
}));

const getFilmByIdMock = vi.mocked(getFilmById);

describe('useAdminFilm', () => {
  beforeEach(() => {
    getFilmByIdMock.mockReset();
  });

  it('returns idle for create mode', () => {
    const { result } = renderHook(() => useAdminFilm('create'));
    expect(result.current).toEqual({ status: 'idle' });
  });

  it('loads film in edit mode', async () => {
    getFilmByIdMock.mockResolvedValue({
      id: 1,
      filmNameRu: 'Матрица',
    });

    const { result } = renderHook(() => useAdminFilm('edit', 1));

    await waitFor(() => expect(result.current.status).toBe('ready'));
    expect(result.current).toEqual({
      status: 'ready',
      film: { id: 1, filmNameRu: 'Матрица' },
    });
  });

  it('sets missing when api returns null (404)', async () => {
    getFilmByIdMock.mockResolvedValue(null);

    const { result } = renderHook(() => useAdminFilm('edit', 42));

    await waitFor(() => expect(result.current.status).toBe('missing'));
  });

  it('sets error when api rejects', async () => {
    getFilmByIdMock.mockRejectedValue(new Error('network'));

    const { result } = renderHook(() => useAdminFilm('edit', 1));

    await waitFor(() => expect(result.current.status).toBe('error'));
    expect(result.current).toMatchObject({
      status: 'error',
      message: 'Не удалось загрузить фильм',
    });
  });

  it('retries when reloadToken bumps', async () => {
    getFilmByIdMock.mockRejectedValueOnce(new Error('network')).mockResolvedValueOnce({
      id: 1,
      filmNameRu: 'Ok',
    });

    const { result, rerender } = renderHook(
      ({ token }: { token: number }) => useAdminFilm('edit', 1, token),
      { initialProps: { token: 0 } }
    );

    await waitFor(() => expect(result.current.status).toBe('error'));

    await act(async () => {
      rerender({ token: 1 });
    });

    await waitFor(() => expect(result.current.status).toBe('ready'));
  });
});
