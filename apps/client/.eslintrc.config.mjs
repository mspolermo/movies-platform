import globals from 'globals'
import jsConfig from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import importPlugin from 'eslint-plugin-import'
import prettierConfig from 'eslint-config-prettier'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'

import { createRequire } from 'module'
import boundaries from 'eslint-plugin-boundaries'

/** @type {import('eslint').Linter.Config[]} */
const reactConfig = [
  { ignores: ['node_modules', '.next', 'dist'] },
  jsConfig.configs.recommended,
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    languageOptions: {
      parser: tsParser,
      sourceType: 'module',
      ecmaVersion: 'latest',
      globals: globals.browser,
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.ts', '.jsx', '.tsx'],
        },
        typescript: { alwaysTryTypes: true },
      }
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      'import/extensions': ['error', 'ignorePackages', { 
        js: 'never',
        ts: 'never',
        jsx: 'never',
        tsx: 'never',
      }],
      // сортировка импортов
      'import/order': [
        'error',
        {
          groups: [['type'], ['builtin', 'external'], ['internal'], ['parent', 'sibling']],
          pathGroups: [
            {
              pattern: '{react,react-dom/**}',
              group: 'external',
              position: 'before',
            }
          ],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          'newlines-between': 'always',
        }
      ],
      // исключения в правиле
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_', // игнорировать аргументы начинающиеся с _
          varsIgnorePattern: '^_', // игнорировать переменные начинающиеся с _
        }
      ],
      // Предпочитать использование import type
      '@typescript-eslint/consistent-type-imports': ['error', {prefer: 'type-imports'}],
      // Запрет на использование console, но разрешаем console.error, console.warn и console.info
      'no-console': ['error', { allow: ['error', 'warn', 'info'] }],
      // если переменная не изменяется то обязательно использовать const
      'prefer-const': ['error', {
        destructuring: 'any',
        ignoreReadBeforeAssign: false,
      }],
    }
  },
  {
    files: ['vitest.config.ts'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        }
      }
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs['jsx-runtime'].rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'react/jsx-sort-props': [
        'error',
        {
          callbacksLast: true,
          shorthandFirst: true,
          ignoreCase: false,
          reservedFirst: true,
        }
      ]
    }
  },
  prettierConfig
]

const require = createRequire(import.meta.url)

const importOrder = require('@feature-sliced/eslint-config/rules/import-order')
const layersSlices = require('@feature-sliced/eslint-config/rules/layers-slices')
const publicApi = require('@feature-sliced/eslint-config/rules/public-api')

const importOrderFlat = {
  files: ['**/*.{js,ts,jsx,tsx}'],
  plugins: {
    import: importPlugin,
  },
  rules: importOrder.rules
}

const layersSlicesFlat = {
  files: ['**/*.{js,ts,jsx,tsx}'],
  ...boundaries.configs.recommended,
  plugins: {
    boundaries
  },
  settings: layersSlices.settings,
  rules: layersSlices.rules
}

const publicApiFlat = {
  files: ['**/*.{js,ts,jsx,tsx}'],
  plugins: {
    import: importPlugin,
  },
  rules: publicApi.rules
}


/** @type {import('eslint').Linter.Config[]} */
export default [
  importOrderFlat,
  publicApiFlat,
  layersSlicesFlat,
  ...reactConfig,
]