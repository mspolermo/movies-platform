import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const configDir = path.dirname(fileURLToPath(import.meta.url));
const clientRoot = path.resolve(configDir, '../..');
const monorepoRoot = path.resolve(clientRoot, '../..');

export default defineConfig({
  resolve: {
    alias: {
      '@': path.join(clientRoot, 'src'),
      '@/shared': path.join(clientRoot, 'src/shared'),
      '@/entities': path.join(clientRoot, 'src/entities'),
      '@/features': path.join(clientRoot, 'src/features'),
      '@/widgets': path.join(clientRoot, 'src/widgets'),
      '@/pages': path.join(clientRoot, 'src/pages'),
      '@/app': path.join(clientRoot, 'src/app'),
      '@common': path.join(monorepoRoot, 'apps/common'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: [path.join(configDir, 'vitest.setup.ts')],
    globals: true,
  },
});
