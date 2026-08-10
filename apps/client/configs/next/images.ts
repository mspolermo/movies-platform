import type { NextConfig } from 'next';

// next.config: relative → apps/common (alias `@common/*` здесь не резолвится)
// eslint-disable-next-line import/no-internal-modules
import { API_GATEWAY_URL } from '../../../common/constants/network';

type TRemotePattern = NonNullable<NonNullable<NextConfig['images']>['remotePatterns']>[number];

/** `images.remotePatterns` для постеров KP + локальный gateway. */
export const createImageRemotePatterns = (): TRemotePattern[] => {
  const defaultGateway = new URL(API_GATEWAY_URL);

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
