'use client';

import { useSyncExternalStore } from 'react';

import { getUsersSnapshot, subscribeUsers } from '../../api';

/** React-подписка на список пользователей (заглушка). */
export const useAdminUsers = () =>
  useSyncExternalStore(subscribeUsers, getUsersSnapshot, getUsersSnapshot);
