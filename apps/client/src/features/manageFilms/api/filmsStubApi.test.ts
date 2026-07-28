import { beforeEach, describe, expect, it } from 'vitest';

import {
  createFilmStub,
  deleteFilmStub,
  getFilmByIdStub,
  getFilmsSnapshot,
  listFilmsStub,
  resetFilmsStub,
  updateFilmStub,
} from './filmsStubApi';

describe('filmsStubApi', () => {
  beforeEach(() => {
    resetFilmsStub();
  });

  it('listFilmsStub returns all without q', async () => {
    const list = await listFilmsStub();
    expect(list).toEqual(getFilmsSnapshot());
    expect(list).toHaveLength(2);
  });

  it('listFilmsStub filters by q', async () => {
    const list = await listFilmsStub('матриц');
    expect(list).toHaveLength(1);
    expect(list[0]?.filmNameRu).toBe('Матрица');
  });

  it('updateFilmStub returns null for unknown id', async () => {
    await expect(updateFilmStub(99999, { filmNameRu: 'X' })).resolves.toBeNull();
  });

  it('getFilmByIdStub / create / delete roundtrip', async () => {
    const created = await createFilmStub({ filmNameRu: 'Test Film' });
    await expect(getFilmByIdStub(created.id)).resolves.toMatchObject({ filmNameRu: 'Test Film' });
    await expect(deleteFilmStub(created.id)).resolves.toBe(true);
    await expect(getFilmByIdStub(created.id)).resolves.toBeNull();
  });
});
