import { HttpException } from "@nestjs/common";

/** Достаёт текст ошибки из Nest RMQ / RxJS (вложенный message, string, object). */
export const extractRpcErrorMessage = (error: unknown): string => {
  if (error == null) {
    return "";
  }

  if (typeof error === "string") {
    return error;
  }

  if (typeof error !== "object") {
    return String(error);
  }

  const record = error as Record<string, unknown>;
  const message = record.message;

  if (typeof message === "string") {
    return message;
  }

  if (message && typeof message === "object") {
    const nested = message as Record<string, unknown>;
    if (typeof nested.message === "string") {
      return nested.message;
    }
  }

  if (record.response) {
    return extractRpcErrorMessage(record.response);
  }

  return "";
};

/** Case-insensitive поиск подстроки в RPC-ошибке. */
export const rpcMessageIncludes = (
  error: unknown,
  ...needles: string[]
): boolean => {
  const haystack = extractRpcErrorMessage(error).toLowerCase();
  return needles.some((needle) => haystack.includes(needle.toLowerCase()));
};

/**
 * Достаёт HTTP-статус из RPC-ошибки. Понимает оба формата (ADR-007):
 * payload `RpcException({ statusCode })` и сериализованный `HttpException`
 * (`status` / вложенный `response.statusCode`).
 */
const extractRpcErrorStatus = (error: unknown): number | undefined => {
  if (!error || typeof error !== "object") {
    return undefined;
  }

  const record = error as Record<string, unknown>;

  if (typeof record.statusCode === "number") {
    return record.statusCode;
  }
  if (typeof record.status === "number") {
    return record.status;
  }

  if (record.response && typeof record.response === "object") {
    const response = record.response as Record<string, unknown>;
    if (typeof response.statusCode === "number") {
      return response.statusCode;
    }
    if (typeof response.status === "number") {
      return response.status;
    }
  }

  return undefined;
};

/** Перебрасывает RPC-ошибку микросервиса как HttpException; fallback — 500. */
export function throwHttpFromRpcError(error: unknown): never {
  const statusCode = extractRpcErrorStatus(error) ?? 500;
  const message = extractRpcErrorMessage(error) || "Внутренняя ошибка сервиса";

  throw new HttpException({ statusCode, message }, statusCode);
}

/** `await` RMQ-вызова; ошибку маппит в HttpException. */
export function fromRpc<T>(promise: Promise<T>): Promise<T> {
  return promise.catch((error: unknown) => throwHttpFromRpcError(error));
}
