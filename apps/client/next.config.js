/** @type {import('next').NextConfig} */
const nextConfig = {
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
