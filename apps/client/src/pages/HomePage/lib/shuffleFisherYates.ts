/**
 * Перемешивание списка (Fisher–Yates) для главной: не всегда одни и те же жанры.
 *
 * Seed (например UTC-день) делает порядок воспроизводимым:
 * - весь день один набор жанров → кэш `unstable_cache` осмыслен;
 * - завтра другой seed → другой набор.
 * Без seed — обычный Math.random.
 *
 * Mulberry32 — детерминированный PRNG из числа seed.
 */
const createMulberry32 = (seed: number): (() => number) => {
  let state = seed >>> 0;

  return () => {
    state += 0x6d2b79f5;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/**
 * Fisher–Yates shuffle (копия массива, исходный не мутирует).
 * @param seed — если задан, порядок детерминирован (например UTC-день).
 */
export const shuffleFisherYates = <T>(items: readonly T[], seed?: number): T[] => {
  const result = [...items];
  const random = seed === undefined ? Math.random : createMulberry32(seed);

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }

  return result;
};
