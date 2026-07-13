const TOKEN_KEY = 'token';

//TODO: выглядит как плохая практика токен в сторадже хранить

export const getToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

export const hasToken = (): boolean => Boolean(getToken());
