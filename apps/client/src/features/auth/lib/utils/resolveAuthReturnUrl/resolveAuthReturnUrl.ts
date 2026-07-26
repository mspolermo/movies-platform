/**
 * Безопасный returnUrl после логина: только same-origin relative path.
 */
export const resolveAuthReturnUrl = (raw: string | null | undefined): string => {
  if (!raw) {
    return '/films';
  }

  const value = raw.trim();

  if (
    !value.startsWith('/') ||
    value.startsWith('//') ||
    value.includes('://') ||
    value.includes('\\') ||
    value.startsWith('/auth/')
  ) {
    return '/films';
  }

  return value;
};
