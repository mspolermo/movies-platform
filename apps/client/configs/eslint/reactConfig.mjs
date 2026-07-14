import globals from 'globals'
import jsConfig from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import importPlugin from 'eslint-plugin-import'
import prettierConfig from 'eslint-config-prettier'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import nextPlugin from '@next/eslint-plugin-next'

// TS + React + Next + Prettier; порядок блоков важен (ниже переопределяет выше).
/** @type {import('eslint').Linter.Config[]} */
export const reactConfig = [
  { ignores: ['node_modules', '.next', 'dist'] },
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
      // Запрет на использование console, но разрешаем console.error, console.warn и console.info
      'no-console': ['error', { allow: ['error', 'warn', 'info'] }],
      // если переменная не изменяется то обязательно использовать const
      'prefer-const': ['error', {
        destructuring: 'any',
        ignoreReadBeforeAssign: false,
      }],
      // без React.FC — явные пропсы: (props: Props) => …
      '@typescript-eslint/ban-types': [
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
    // vitest — node globals
    files: ['vitest.config.ts'],
    languageOptions: { globals: globals.node },
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
    // next.config, scripts — require() без ошибки
    files: ['next.config.js', 'scripts/**/*.js'],
    languageOptions: { globals: globals.node },
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
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
]

