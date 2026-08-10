import globals from 'globals'
import jsConfig from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import importPlugin from 'eslint-plugin-import'
import prettierConfig from 'eslint-config-prettier'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import nextPlugin from '@next/eslint-plugin-next'

import { commonModuleRules } from './commonModuleRules.mjs'

/**
 * Единственный ESLint-стек клиента (см. eslint.config.mjs).
 * Парсер — только `@typescript-eslint/parser` v8 из этого файла.
 * НЕ подключаем `eslint-config-next` (тянет @typescript-eslint@6 и свой parser).
 * Next-правила — через `@next/eslint-plugin-next` ниже.
 */
// TS + React + Next + Prettier; порядок блоков важен (ниже переопределяет выше).
/** @type {import('eslint').Linter.Config[]} */
export const reactConfig = [
  { ignores: ['node_modules', '.next', 'dist', 'next-env.d.ts', 'storybook-static'] },
  jsConfig.configs.recommended,
  {
    // база: парсер TS, import resolver, правила стиля кода
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
      },
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
            },
          ],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          'newlines-between': 'always',
        },
      ],
      // исключения в правиле
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_', // игнорировать аргументы начинающиеся с _
          varsIgnorePattern: '^_', // игнорировать переменные начинающиеся с _
        },
      ],
      // Предпочитать использование import type
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      ...commonModuleRules,
      // Запрет на использование console, но разрешаем console.error, console.warn и console.info
      'no-console': ['error', { allow: ['error', 'warn', 'info'] }],
      // если переменная не изменяется то обязательно использовать const
      'prefer-const': ['error', {
        destructuring: 'any',
        ignoreReadBeforeAssign: false,
      }],
      // без React.FC — явные пропсы: (props: Props) => …
      '@typescript-eslint/no-restricted-types': [
        'error',
        {
          types: {
            'React.FC': {
              message:
                'Не используй React.FC. Пиши `export const C = (props: Props) =>` или деструктуризацию в аргументе.',
            },
            'React.FunctionComponent': {
              message:
                'Не используй React.FunctionComponent. Пиши `export const C = (props: Props) =>`.',
            },
            'React.VFC': {
              message:
                'Не используй React.VFC. Пиши `export const C = (props: Props) =>`.',
            },
            FC: {
              message:
                'Не используй FC из react. Пиши `export const C = (props: Props) =>`.',
            },
            FunctionComponent: {
              message:
                'Не используй FunctionComponent из react. Пиши `export const C = (props: Props) =>`.',
            },
          },
        },
      ],
    },
  },
  {
    // vitest + shared tooling mocks — node globals; не FSD
    files: ['configs/vitest/**/*.{ts,tsx}', 'configs/mocks/**/*.{ts,tsx}'],
    languageOptions: { globals: globals.node },
    rules: {
      'import/no-internal-modules': 'off',
    },
  },
  {
    // Next server routes + SSR config — process.env
    files: ['app/**/*.{ts,tsx}', 'src/shared/api/config/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.browser,
        process: 'readonly',
      },
    },
  },
  {
    // React: recommended + jsx-runtime + hooks + сортировка пропсов
    files: ['**/*.{js,ts,jsx,tsx}'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
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
        },
      ],
    },
  },
  {
    // правила Next.js
    files: ['**/*.{js,ts,jsx,tsx}'],
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      '@next/next/no-html-link-for-pages': 'error',
      '@next/next/no-sync-scripts': 'error',
    },
  },
  // отключает правила, конфликтующие с Prettier
  prettierConfig,
  {
    // next.config + configs/next — Node globals; relative → apps/common (alias не резолвится)
    files: [
      '**/next.config.js',
      '**/next.config.ts',
      '**/next.config.mjs',
      'scripts/**/*.js',
      'configs/next/**/*.{ts,tsx}',
      'configs/storybook/**/*.{ts,tsx}',
    ],
    languageOptions: { globals: globals.node },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      'import/no-internal-modules': 'off',
    },
  },
  {
    // Storybook CSF — default export meta/stories
    files: ['**/stories/**/*.stories.@(ts|tsx)'],
    rules: {
      'import/no-default-export': 'off',
    },
  },
]
