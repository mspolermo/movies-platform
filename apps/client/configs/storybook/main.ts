import type { StorybookConfig } from '@storybook/nextjs-vite';
import type { FileImporter } from 'sass';

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const configDir = path.dirname(fileURLToPath(import.meta.url));
const clientRoot = path.resolve(configDir, '../..');
const srcRoot = path.join(clientRoot, 'src');

/** Sass `@use '@/…'` → файл под `src/` (как Next path alias). */
const atAliasImporter: FileImporter<'sync'> = {
  findFileUrl(url) {
    if (!url.startsWith('@/')) return null;
    const base = path.join(srcRoot, url.slice(2));
    const candidates = [
      `${base}.scss`,
      `${base}.sass`,
      `${base}/index.scss`,
      path.join(path.dirname(base), `_${path.basename(base)}.scss`),
    ];
    for (const candidate of candidates) {
      if (fs.existsSync(candidate)) return pathToFileURL(candidate);
    }
    return null;
  },
};

const config: StorybookConfig = {
  stories: ['../../src/shared/ui/**/stories/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/nextjs-vite',
    options: {
      // plain `.svg` → SVGR, не next/image
      image: { excludeFiles: ['**/*.svg'] },
    },
  },
  staticDirs: [],
  async viteFinal(viteConfig) {
    const { default: svgr } = await import('vite-plugin-svgr');
    const { default: tsconfigPaths } = await import('vite-tsconfig-paths');

    viteConfig.plugins = [
      ...(viteConfig.plugins ?? []),
      tsconfigPaths({ projects: [path.join(clientRoot, 'tsconfig.json')] }),
      svgr({
        include: '**/*.svg',
        svgrOptions: {
          svgo: true,
          svgoConfig: {
            plugins: [
              {
                name: 'preset-default',
                params: { overrides: { removeViewBox: false } },
              },
            ],
          },
        },
      }),
    ];

    const existingAlias =
      typeof viteConfig.resolve?.alias === 'object' && !Array.isArray(viteConfig.resolve.alias)
        ? viteConfig.resolve.alias
        : {};

    viteConfig.resolve = {
      ...viteConfig.resolve,
      alias: {
        ...existingAlias,
        '@': srcRoot,
        // Next 16 Image — mock для stories с RemotePoster
        'next/image': path.join(configDir, '../mocks/next-image.tsx'),
      },
    };

    viteConfig.css = {
      ...viteConfig.css,
      preprocessorOptions: {
        ...viteConfig.css?.preprocessorOptions,
        scss: {
          loadPaths: [path.join(clientRoot, 'src/app/styles'), srcRoot],
          importers: [atAliasImporter],
        },
      },
    };

    return viteConfig;
  },
};

export default config;
