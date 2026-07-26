import { DEFAULT_POST_AUTH_PATH } from '@/shared/api/session';

/**
 * Безопасный returnUrl после логина: только same-origin relative path.
 */
export const resolveAuthReturnUrl = (raw: string | null | undefined): string => {
  if (!raw) {
    return DEFAULT_POST_AUTH_PATH;
  }

  const value = raw.trim();

  if (
    !value.startsWith('/') ||
    value.startsWith('//') ||
    value.includes('://') ||
    value.includes('\\') ||
    value.startsWith('/auth/')
  ) {
    return DEFAULT_POST_AUTH_PATH;
  }

  return value;
};
