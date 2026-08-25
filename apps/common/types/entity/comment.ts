/** Доменная сущность комментария с полями, которые реально хранятся в таблице. */
export type TCommentEntity = {
  id: number;
  title: string;
  text: string;
  authorId: number;
  authorName: string;
  filmId: number;
  createdAt: Date;
};
