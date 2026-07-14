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
