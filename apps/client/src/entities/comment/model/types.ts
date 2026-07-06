//TODO: вытащить в common

export type TComment = {
  id: number;

  title: string;
  text: string;

  authorId: number;
  authorName: string;

  filmId: number;
  parentId: number | null;

  createdAt: string;
}