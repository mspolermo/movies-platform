'use client';

import type { ReactNode } from 'react';

import { useEffect } from 'react';

import { useUserStore } from '@/entities/user';
import { setSessionBridge } from '@/shared/api';

import { bootstrapSession } from '../../model';

type TAuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: TAuthProviderProps) => {
  useEffect(() => {
    setSessionBridge({
      onAuthenticated: (user) => {
        useUserStore.getState().setUser(user);
        useUserStore.getState().setStatus('authenticated');
      },
      onUnauthenticated: () => {
        useUserStore.getState().reset();
      },
    });
    void bootstrapSession();
  }, []);

  return children;
};
