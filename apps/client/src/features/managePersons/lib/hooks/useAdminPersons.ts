'use client';

import { useSyncExternalStore } from 'react';

import { getPersonsSnapshot, subscribePersons } from '../../api';

/** React-подписка на список персон (заглушка). */
export const useAdminPersons = () =>
  useSyncExternalStore(subscribePersons, getPersonsSnapshot, getPersonsSnapshot);
