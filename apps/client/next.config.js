const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Корень монорепы: Turbopack не уходит выше (чужой ~/package-lock),
  // file tracing видит `@common` (apps/common). Оба поля должны совпадать.
  turbopack: {
    root: path.join(__dirname, '../..'),
  },
  outputFileTracingRoot: path.join(__dirname, '../..'),
  sassOptions: {
    includePaths: ['./src/app/styles'],
  },
  images: {
    remotePatterns: [
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
        protocol: 'http',
        hostname: 'localhost',
        port: '5001',
        pathname: '/**',
      },
    ],
  },
  /**
   * Прокси `/api/*` → api-gateway.
   * Браузер ходит на same-origin `/api` (cookies, CORS не нужны); Next переписывает на gateway.
   * `API_GATEWAY_URL` — куда проксировать (локально :5001, в Docker — `http://api-gateway:5000`).
   */
  async rewrites() {
    const apiGatewayUrl = process.env.API_GATEWAY_URL ?? 'http://localhost:5001';

    return [
      {
        source: '/api/:path*',
        destination: `${apiGatewayUrl}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
