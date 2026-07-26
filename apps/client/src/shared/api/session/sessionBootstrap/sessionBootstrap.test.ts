import { describe, expect, it, vi } from 'vitest';

import {
  isSessionBootstrapping,
  runSessionBootstrap,
  waitForSessionBootstrap,
} from './sessionBootstrap';

describe('sessionBootstrap', () => {
  it('single-flight: parallel runs share one promise', async () => {
    let resolveTask!: () => void;
    const task = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveTask = resolve;
        })
    );

    const first = runSessionBootstrap(task);
    const second = runSessionBootstrap(task);

    expect(first).toBe(second);
    expect(task).toHaveBeenCalledTimes(1);
    expect(isSessionBootstrapping()).toBe(true);

    resolveTask();
    await first;
    expect(isSessionBootstrapping()).toBe(false);
  });

  it('waitForSessionBootstrap resolves when idle', async () => {
    await expect(waitForSessionBootstrap()).resolves.toBeUndefined();
  });

  it('waitForSessionBootstrap waits for in-flight bootstrap', async () => {
    let resolveTask!: () => void;
    const task = () =>
      new Promise<void>((resolve) => {
        resolveTask = resolve;
      });

    const bootstrap = runSessionBootstrap(task);
    const waited = waitForSessionBootstrap();

    resolveTask();
    await Promise.all([bootstrap, waited]);
  });
});
