/** Хосты, которые режут server-side fetch Next Image Optimizer (403). */
const IMAGE_OPTIMIZER_BLOCKED_HOSTS = [
  'st.kp.yandex.net',
  'avatars.mds.yandex.net',
  'kinopoiskapiunofficial.tech',
] as const;

/**
 * KP/Yandex блокируют `/_next/image` без browser UA.
 * Для таких URL отдаём `unoptimized` — браузер грузит напрямую.
 */
export const shouldSkipImageOptimization = (src: string): boolean => {
  try {
    const { hostname } = new URL(src);
    return IMAGE_OPTIMIZER_BLOCKED_HOSTS.some(
      (host) => hostname === host || hostname.endsWith(`.${host}`)
    );
  } catch {
    return false;
  }
};
