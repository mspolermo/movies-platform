/**
 * In-memory хранилище access token.
 * Не в React state и не в web storage — только для Authorization header.
 */
let accessToken: string | null = null;

export const getAccessToken = (): string | null => accessToken;

/** Сохранить token после login / register / refresh. */
export const setAccessToken = (token: string): void => {
  accessToken = token;
};

/** Сбросить token при logout или неуспешном refresh. */
export const clearAccessToken = (): void => {
  accessToken = null;
};
