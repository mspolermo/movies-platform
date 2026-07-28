import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useAdminCrudPanel } from './useAdminCrudPanel';

describe('useAdminCrudPanel', () => {
  it('blocks close while pending and closes after success when session matches', async () => {
    const { result } = renderHook(() => useAdminCrudPanel<{ id: number }>());

    act(() => {
      result.current.openCreate();
    });
    expect(result.current.isFormOpen).toBe(true);

    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });

    let pendingDone: Promise<boolean>;
    act(() => {
      pendingDone = result.current.runPending(async () => {
        await gate;
      });
    });

    expect(result.current.pending).toBe(true);

    act(() => {
      result.current.requestCloseForm();
    });
    expect(result.current.isFormOpen).toBe(true);

    await act(async () => {
      release();
      await pendingDone!;
    });

    expect(result.current.pending).toBe(false);

    act(() => {
      result.current.closeForm();
    });
    expect(result.current.isFormOpen).toBe(false);
  });

  it('sets error on reject and returns false', async () => {
    const { result } = renderHook(() => useAdminCrudPanel<{ id: number }>());

    act(() => {
      result.current.openCreate();
    });

    let ok = true;
    await act(async () => {
      ok = await result.current.runPending(async () => {
        throw new Error('fail');
      });
    });

    expect(ok).toBe(false);
    expect(result.current.error).toBe('Не удалось выполнить действие');
    expect(result.current.isFormOpen).toBe(true);
  });

  it('returns false when form session changes during pending', async () => {
    const { result } = renderHook(() => useAdminCrudPanel<{ id: number }>());

    act(() => {
      result.current.openCreate();
    });

    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });

    let pendingDone!: Promise<boolean>;
    act(() => {
      pendingDone = result.current.runPending(async () => {
        await gate;
      });
    });

    act(() => {
      result.current.openEdit({ id: 1 });
    });

    let ok = true;
    await act(async () => {
      release();
      ok = await pendingDone;
    });

    expect(ok).toBe(false);
    expect(result.current.editing?.id).toBe(1);
  });
});
