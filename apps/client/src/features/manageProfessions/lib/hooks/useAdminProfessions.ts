'use client';

import { useSyncExternalStore } from 'react';

import { getProfessionsSnapshot, subscribeProfessions } from '../../api';

/** React-подписка на список профессий (заглушка). */
export const useAdminProfessions = () =>
  useSyncExternalStore(subscribeProfessions, getProfessionsSnapshot, getProfessionsSnapshot);
