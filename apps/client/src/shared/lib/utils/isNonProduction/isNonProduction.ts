/**
 * Не production-сборка (dev / test).
 * Next инлайнит `NODE_ENV` → в prod ветки с этой проверкой вырезаются.
 */
// eslint-disable-next-line no-undef -- Next.js replaces process.env.NODE_ENV at build
export const isNonProduction = process.env.NODE_ENV !== 'production';
