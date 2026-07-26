/**
 * Dev-only stub logger. В production Next инлайнит NODE_ENV → мёртвый код.
 */
export const debugStubLog = (message: string, payload?: unknown): void => {
  // eslint-disable-next-line no-undef -- Next.js replaces process.env.NODE_ENV at build
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  if (payload === undefined) {
    // eslint-disable-next-line no-console -- stub / диагностический лог
    console.log(message);
  } else {
    // eslint-disable-next-line no-console -- stub / диагностический лог
    console.log(message, payload);
  }
};
