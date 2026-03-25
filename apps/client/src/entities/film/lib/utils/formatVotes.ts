/**
 * Форматирует количество голосов (К / М).
 */
export const formatVotes = (votes?: number): string => {
  if (votes == null) return '0 оценок';

  if (votes >= 1_000_000) {
    const millions = Math.round(votes / 100_000) / 10;
    return `${millions}М оценок`;
  }

  if (votes >= 1_000) {
    const thousands = Math.round(votes / 100) / 10;
    return `${thousands}К оценок`;
  }

  return `${votes} оценок`;
};
