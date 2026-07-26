'use client';

import type { TAuthorizedUserResponse } from '@common/types';

import type { PropsWithChildren } from 'react';

import { useEffect } from 'react';

import { buildLoginHref, useUserStore } from '@/entities/user';
import { clearSessionBridgeIf, setSessionBridge } from '@/shared/api/session';

import { bootstrapSession } from '../../lib';

/**
 * Регистрирует session-bridge и поднимает bootstrap сессии.
 */
export const AuthProvider = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    const bridge = {
      onAuthenticated: (user: TAuthorizedUserResponse) => {
        useUserStore.getState().setUser(user);
        useUserStore.getState().setStatus('authenticated');
      },
      onUnauthenticated: () => {
        useUserStore.getState().reset();
      },
      onSessionExpired: () => {
        if (typeof window === 'undefined') {
          return;
        }

        if (window.location.pathname.startsWith('/auth/')) {
          return;
        }

        window.location.assign(buildLoginHref());
      },
    };

    setSessionBridge(bridge);
    void bootstrapSession();

    return () => {
      // microtask: Strict Mode remount успеет поставить новый bridge до clear
      queueMicrotask(() => {
        clearSessionBridgeIf(bridge);
      });
    };
  }, []);

  return children;
};
