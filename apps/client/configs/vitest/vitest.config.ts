import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const configDir = path.dirname(fileURLToPath(import.meta.url));
const clientRoot = path.resolve(configDir, '../..');
const monorepoRoot = path.resolve(clientRoot, '../..');

/** SVG → React-компонент (как SVGR в configs/next/svgr). */
const svgAsReactPlugin = {
  name: 'svg-as-react',
  enforce: 'pre' as const,
  load(id: string) {
    if (!id.endsWith('.svg')) return null;
    return {
      code: `
        import { createElement } from 'react';
        export default function SvgIcon(props) {
          return createElement('svg', props);
        }
      `,
      map: null,
    };
  },
};

export default defineConfig({
  plugins: [svgAsReactPlugin, react()],
  resolve: {
    alias: {
      '@': path.join(clientRoot, 'src'),
      '@common': path.join(monorepoRoot, 'apps/common'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: [path.join(configDir, 'vitest.setup.ts')],
    globals: true,
  },
});
