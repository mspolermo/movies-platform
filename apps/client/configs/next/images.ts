import type { NextConfig } from 'next';

import { DEFAULT_SSR_API_BASE_URL } from '../../src/shared/api/endpoints';

type TRemotePattern = NonNullable<NonNullable<NextConfig['images']>['remotePatterns']>[number];

/** `images.remotePatterns` для постеров KP + локальный gateway. */
export const createImageRemotePatterns = (): TRemotePattern[] => {
  const defaultGateway = new URL(DEFAULT_SSR_API_BASE_URL);

  return [
    {
      protocol: 'https',
      hostname: 'st.kp.yandex.net',
      port: '',
      pathname: '/images/**',
    },
    {
      protocol: 'https',
      hostname: 'avatars.mds.yandex.net',
      port: '',
      pathname: '/**',
    },
    {
      protocol: 'https',
      hostname: 'kinopoiskapiunofficial.tech',
      port: '',
      pathname: '/images/**',
    },
    {
      protocol: defaultGateway.protocol.replace(':', '') as 'http' | 'https',
      hostname: defaultGateway.hostname,
      port: defaultGateway.port,
      pathname: '/**',
    },
  ];
};
