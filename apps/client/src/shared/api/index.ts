export { default } from './client';
export { API_ENDPOINTS } from './endpoints';
export { getApiBaseUrl } from './config';
export { loginUser, registerUser, refreshSession, logoutUser, getCurrentUser } from './auth';
export type { TLoginParams, TRegisterParams } from './auth';
export { setAccessToken, clearAccessToken, runSessionBootstrap } from './lib';

export { getAccessToken } from './lib';
export { hasSessionCookie, clearHasSessionCookie } from './lib';
export { setSessionBridge } from './lib';
