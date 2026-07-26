let bootstrapPromise: Promise<void> | null = null;
let isBootstrapping = false;

/** Single-flight bootstrap — AuthProvider и 401-interceptor ждут один promise. */
export const runSessionBootstrap = (task: () => Promise<void>): Promise<void> => {
  if (bootstrapPromise) {
    return bootstrapPromise;
  }

  isBootstrapping = true;
  bootstrapPromise = task().finally(() => {
    isBootstrapping = false;
    bootstrapPromise = null;
  });

  return bootstrapPromise;
};

/** Дождаться завершения bootstrap перед retry после 401. */
export const waitForSessionBootstrap = (): Promise<void> => {
  return bootstrapPromise ?? Promise.resolve();
};

/** Идёт ли сейчас bootstrap (для отложенного redirect после 401). */
export const isSessionBootstrapping = (): boolean => isBootstrapping;
