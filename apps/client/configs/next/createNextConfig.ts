import type { NextConfig } from 'next';

import path from 'path';
import { fileURLToPath } from 'url';

import { createImageRemotePatterns } from './images';
import { createApiRewrites } from './rewrites';
import { applySvgrWebpack, svgrTurbopackRules } from './svgr';

const configsNextDir = path.dirname(fileURLToPath(import.meta.url));
const clientRoot = path.join(configsNextDir, '../..');
/** Корень монорепы: Turbopack + outputFileTracing должны совпадать. */
const monorepoRoot = path.join(clientRoot, '../..');

/** Полный NextConfig; точка входа — `apps/client/next.config.ts`. */
export const createNextConfig = (): NextConfig => ({
  // Корень монорепы: Turbopack не уходит выше (чужой ~/package-lock),
  // file tracing видит `@common` (apps/common).
  turbopack: {
    root: monorepoRoot,
    rules: svgrTurbopackRules,
  },
  outputFileTracingRoot: monorepoRoot,
  sassOptions: {
    includePaths: ['./src/app/styles'],
  },
  webpack(config) {
    return applySvgrWebpack(config);
  },
  images: {
    remotePatterns: createImageRemotePatterns(),
  },
  rewrites: createApiRewrites,
});
