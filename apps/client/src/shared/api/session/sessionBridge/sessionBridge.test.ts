import { describe, expect, it, vi } from 'vitest';

import {
  clearSessionBridgeIf,
  notifyAuthenticated,
  notifySessionExpired,
  notifyUnauthenticated,
  setSessionBridge,
} from './sessionBridge';

describe('sessionBridge', () => {
  it('notifies authenticated / unauthenticated / expired', () => {
    const onAuthenticated = vi.fn();
    const onUnauthenticated = vi.fn();
    const onSessionExpired = vi.fn();

    setSessionBridge({ onAuthenticated, onUnauthenticated, onSessionExpired });

    const user = {
      id: 1,
      email: 'a@b.c',
      name: undefined as string | undefined,
      roles: [] as { id: number; value: string; description: string }[],
    };

    notifyAuthenticated(user);
    expect(onAuthenticated).toHaveBeenCalledWith(user);

    notifyUnauthenticated();
    expect(onUnauthenticated).toHaveBeenCalledTimes(1);

    notifySessionExpired();
    expect(onSessionExpired).toHaveBeenCalledTimes(1);
  });

  it('expired is optional', () => {
    setSessionBridge({
      onAuthenticated: vi.fn(),
      onUnauthenticated: vi.fn(),
    });

    expect(() => notifySessionExpired()).not.toThrow();
  });

  it('accepts null cleanup', () => {
    const onAuthenticated = vi.fn();
    setSessionBridge({
      onAuthenticated,
      onUnauthenticated: vi.fn(),
    });
    setSessionBridge(null);

    notifyAuthenticated({
      id: 1,
      email: 'a@b.c',
      name: undefined,
      roles: [],
    });
    expect(onAuthenticated).not.toHaveBeenCalled();
  });

  it('clearSessionBridgeIf only clears matching instance', () => {
    const first = {
      onAuthenticated: vi.fn(),
      onUnauthenticated: vi.fn(),
    };
    const second = {
      onAuthenticated: vi.fn(),
      onUnauthenticated: vi.fn(),
    };

    setSessionBridge(first);
    setSessionBridge(second);
    clearSessionBridgeIf(first);

    notifyAuthenticated({
      id: 1,
      email: 'a@b.c',
      name: undefined,
      roles: [],
    });
    expect(first.onAuthenticated).not.toHaveBeenCalled();
    expect(second.onAuthenticated).toHaveBeenCalledTimes(1);

    clearSessionBridgeIf(second);
    notifyAuthenticated({
      id: 2,
      email: 'b@c.d',
      name: undefined,
      roles: [],
    });
    expect(second.onAuthenticated).toHaveBeenCalledTimes(1);
  });
});
