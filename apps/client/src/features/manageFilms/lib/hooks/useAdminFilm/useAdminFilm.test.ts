import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAdminFilm } from './useAdminFilm';
import { getFilmByIdStub } from '../../../api';

vi.mock('../../../api', () => ({
  getFilmByIdStub: vi.fn(),
}));

const getFilmByIdStubMock = vi.mocked(getFilmByIdStub);

describe('useAdminFilm', () => {
  beforeEach(() => {
    getFilmByIdStubMock.mockReset();
  });

  it('returns idle for create mode', () => {
    const { result } = renderHook(() => useAdminFilm('create'));
    expect(result.current).toEqual({ status: 'idle' });
  });

  it('loads film in edit mode', async () => {
    getFilmByIdStubMock.mockResolvedValue({
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

  it('sets missing when stub returns null', async () => {
    getFilmByIdStubMock.mockResolvedValue(null);

    const { result } = renderHook(() => useAdminFilm('edit', 42));

    await waitFor(() => expect(result.current.status).toBe('missing'));
  });

  it('sets error when stub rejects', async () => {
    getFilmByIdStubMock.mockRejectedValue(new Error('network'));

    const { result } = renderHook(() => useAdminFilm('edit', 1));

    await waitFor(() => expect(result.current.status).toBe('error'));
    expect(result.current).toMatchObject({
      status: 'error',
      message: 'Не удалось загрузить фильм',
    });
  });

  it('retries when reloadToken bumps', async () => {
    getFilmByIdStubMock.mockRejectedValueOnce(new Error('network')).mockResolvedValueOnce({
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
