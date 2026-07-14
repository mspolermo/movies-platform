import type { TAuthorizedUserResponse } from '@common/types';

import { create } from 'zustand';

export type TAuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

type TUserState = {
  user: TAuthorizedUserResponse | null;
  status: TAuthStatus;
  setUser: (user: TAuthorizedUserResponse | null) => void;
  setStatus: (status: TAuthStatus) => void;
  reset: () => void;
};

export const useUserStore = create<TUserState>((set) => ({
  user: null,
  status: 'idle',
  setUser: (user) => set({ user }),
  setStatus: (status) => set({ status }),
  reset: () => set({ user: null, status: 'unauthenticated' }),
}));
