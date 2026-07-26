import type { NextConfig } from 'next';

/** Общие опции SVGR для turbopack (dev) и webpack (build) — иначе viewBox может пропасть только в одном из бандлеров. */
export const svgrOptions = {
  svgo: true,
  svgoConfig: {
    plugins: [
      {
        name: 'preset-default',
        params: { overrides: { removeViewBox: false } },
      },
    ],
  },
};

/** Turbopack rule: `*.svg` → React-компонент. */
export const svgrTurbopackRules: NonNullable<NextConfig['turbopack']>['rules'] = {
  '*.svg': {
    loaders: [
      {
        loader: '@svgr/webpack',
        options: svgrOptions,
      },
    ],
    as: '*.js',
  },
};

type TWebpackConfig = Parameters<NonNullable<NextConfig['webpack']>>[0];

type TSvgFileRule = {
  test?: { test?: (value: string) => boolean };
  exclude?: RegExp;
};

const isSvgFileRule = (rule: unknown): rule is TSvgFileRule => {
  if (typeof rule !== 'object' || rule === null || !('test' in rule)) return false;
  const test = (rule as TSvgFileRule).test;
  return typeof test?.test === 'function' && test.test('.svg');
};

/** Webpack: SVG → React-компонент (production-сборка без Turbopack). */
export const applySvgrWebpack = (config: TWebpackConfig): TWebpackConfig => {
  const fileLoaderRule = config.module.rules?.find(isSvgFileRule);

  if (fileLoaderRule) {
    fileLoaderRule.exclude = /\.svg$/i;
  }

  config.module.rules?.push({
    test: /\.svg$/i,
    issuer: /\.[jt]sx?$/,
    use: [
      {
        loader: '@svgr/webpack',
        options: svgrOptions,
      },
    ],
  });

  return config;
};
