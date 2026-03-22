// FSD: порядок импортов, boundaries, public API (на базе @feature-sliced/eslint-config).
import importPlugin from 'eslint-plugin-import'

import { createRequire } from 'module'
import boundaries from 'eslint-plugin-boundaries'

const require = createRequire(import.meta.url)

const importOrder = require('@feature-sliced/eslint-config/rules/import-order')
const layersSlices = require('@feature-sliced/eslint-config/rules/layers-slices')
const publicApi = require('@feature-sliced/eslint-config/rules/public-api')

const publicApiAllow = publicApi.rules['import/no-internal-modules'][1].allow

// shared: только index слайса - @/shared и @/shared/<папка> (index), без @/shared/x/y/
const sharedPublicApiAllow = [
  '**/shared/index.{ts,tsx}',
  '**/shared/*/index.{ts,tsx}',
]

// стили рядом с компонентом
const styleAllow = ['**/*.module.scss', '**/*.scss', '**/*.css']

// порядок импортов (FSD)
const importOrderFlat = {
  files: ['**/*.{js,ts,jsx,tsx}'],
  plugins: {
    import: importPlugin,
  },
  rules: importOrder.rules,
}

// границы слоёв/слайсов
const layersSlicesFlat = {
  files: ['**/*.{js,ts,jsx,tsx}'],
  ...boundaries.configs.recommended,
  plugins: {
    boundaries,
  },
  settings: layersSlices.settings,
  rules: layersSlices.rules,
}

// запрет deep-imports: только публичные входы + whitelist стилей
const publicApiFlat = {
  files: ['**/*.{js,ts,jsx,tsx}'],
  plugins: {
    import: importPlugin,
  },
  rules: {
    'import/no-internal-modules': [
      'error',
      {
        allow: [...publicApiAllow, ...sharedPublicApiAllow, ...styleAllow],
      },
    ],
  },
}

// pages/*/index: без default (только named из ui и т.д.)
export const pageIndexBarrel = {
  files: ['src/pages/**/index.{ts,tsx}'],
  plugins: {
    import: importPlugin,
  },
  rules: {
    'import/no-default-export': 'error',
  },
}

const publicApiExport = {
  // В публичных index (barrel): только явные именованные реэкспорты (import/export * запрещены)
  files: ['**/index.ts', '**/index.tsx'],
  plugins: {
    import: importPlugin,
  },
  rules: {
    'import/no-namespace': 'error',
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ExportAllDeclaration',
        message:
          'В публичном index используй явные именованные реэкспорты: export { a, b } from "…", не export * from.',
      },
    ],
  },
}

// сегменты для eslint.config.mjs
/** @type {import('eslint').Linter.Config[]} */
export const fsdConfig = [
  importOrderFlat,
  publicApiFlat,
  layersSlicesFlat,
  pageIndexBarrel,
  publicApiExport
]
