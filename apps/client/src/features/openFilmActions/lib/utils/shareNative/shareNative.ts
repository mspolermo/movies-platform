type TShareNativePayload = {
  title: string;
  text?: string;
  url: string;
};

export const canShareNative = (): boolean => {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
};

/**
 * Web Share API. AbortError (отмена пользователем) глотаем.
 */
export const shareNative = async (
  payload: TShareNativePayload
): Promise<'shared' | 'aborted' | 'unavailable' | 'failed'> => {
  if (!canShareNative()) {
    return 'unavailable';
  }

  try {
    await navigator.share(payload);
    return 'shared';
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return 'aborted';
    }

    return 'failed';
  }
};
