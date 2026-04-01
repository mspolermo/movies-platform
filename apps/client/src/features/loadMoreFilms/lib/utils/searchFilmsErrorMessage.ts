import { isAxiosError } from "axios";

const DEFAULT_ERROR = 'Ошибка загрузки фильмов';

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

/** Сообщение для UI из тела ответа API или дефолт. */
export function searchFilmsErrorMessage(err: unknown): string {
  if (!isAxiosError(err)) return DEFAULT_ERROR;
  return messageFromAxiosData(err.response?.data) ?? DEFAULT_ERROR;
}