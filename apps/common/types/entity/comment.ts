/** Доменная сущность комментария с полями, которые реально хранятся в таблице. */
export type TCommentEntity = {
  id: number;
  header: string;
  value: string;
  authorId: number;
  nickName: string;
  parentId: number | null;
  filmId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

//TODO: исправить на

export type TComment = {
  id: string;

  title: string;
  text: string;

  authorId: number;
  authorName: string;

  filmId: number;
  parentId: number | null;

  createdAt: string;
}