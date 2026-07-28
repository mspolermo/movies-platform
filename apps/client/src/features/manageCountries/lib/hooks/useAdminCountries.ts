'use client';

import { useSyncExternalStore } from 'react';

import { getCountriesSnapshot, subscribeCountries } from '../../api';

/** React-подписка на список стран (заглушка). */
export const useAdminCountries = () =>
  useSyncExternalStore(subscribeCountries, getCountriesSnapshot, getCountriesSnapshot);
