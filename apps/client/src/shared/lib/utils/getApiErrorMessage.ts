import { isAxiosError } from 'axios';

function messageFromAxiosData(data: unknown): string | null {
  if (
    data &&
    typeof data === 'object' &&
    'message' in data &&
    typeof (data as { message: unknown }).message === 'string'
  ) {
    return (data as { message: string }).message;
  }
  return null;
}

/** Сообщение для UI из тела ответа API или `fallback`. */
export function getApiErrorMessage(err: unknown, fallback: string): string {
  if (!isAxiosError(err)) return fallback;
  return messageFromAxiosData(err.response?.data) ?? fallback;
}
