/** Типы для ESLint-плагинов без @types (конфиги в configs/eslint/*.mjs) */
declare module 'eslint-plugin-boundaries' {
  import type { ESLint } from 'eslint';

  const plugin: ESLint.Plugin;
  export default plugin;
}
