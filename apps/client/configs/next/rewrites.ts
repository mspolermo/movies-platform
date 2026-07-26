import process from 'process';

import { DEFAULT_SSR_API_BASE_URL } from '../../src/shared/api/endpoints';

/**
 * Прокси `/api/*` → api-gateway.
 * Браузер ходит на same-origin `/api` (cookies, CORS не нужны); Next переписывает на gateway.
 * `API_GATEWAY_URL` — куда проксировать (локально DEFAULT_SSR_API_BASE_URL, в Docker — `http://api-gateway:5000`).
 */
export const createApiRewrites = async () => {
  const apiGatewayUrl = process.env.API_GATEWAY_URL ?? DEFAULT_SSR_API_BASE_URL;

  return [
    {
      source: '/api/:path*',
      destination: `${apiGatewayUrl}/:path*`,
    },
  ];
};
