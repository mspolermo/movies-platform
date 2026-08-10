import process from 'process';

// next.config: relative → apps/common (alias `@common/*` здесь не резолвится)
// eslint-disable-next-line import/no-internal-modules
import { API_GATEWAY_URL } from '../../../common/constants/network';

/**
 * Прокси `/api/*` → api-gateway.
 * Браузер ходит на same-origin `/api` (cookies, CORS не нужны); Next переписывает на gateway.
 * `API_GATEWAY_URL` — куда проксировать (локально network SoT, в Docker — `http://api-gateway:5000`).
 */
export const createApiRewrites = async () => {
  // `||` — пустая строка env = unset (как cors/RMQ)
  const apiGatewayUrl = process.env.API_GATEWAY_URL || API_GATEWAY_URL;

  return [
    {
      source: '/api/:path*',
      destination: `${apiGatewayUrl}/:path*`,
    },
  ];
};
