//TODO: исправить что написано

/** Доменная сущность комментария с полями, которые реально хранятся в таблице. */
export type TCommentEntity = {
  id: number;

  header: string; //изменить на title
  value: string; // изменить на text

  authorId: number;
  nickName: string; // изменить на authorName

  parentId: number | null;
  filmId: number;

  createdAt: Date;
  updatedAt?: Date;
}


