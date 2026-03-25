/**
 * Форматирует длительность фильма в "Xч. Y мин.".
 */
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (!hours) return `${mins} мин.`;
  return `${hours}ч. ${mins} мин.`;
};
