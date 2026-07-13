export const formatCommentDate = (date: Date | string) =>
  new Intl.DateTimeFormat('ru-RU').format(new Date(date));
