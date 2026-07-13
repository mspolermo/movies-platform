/** Query-параметры GET /comments/:filmId (клиент). */
export type TGetFilmCommentsParams = {
  page?: number;
  perPage?: number;
};

/** Body POST /comments/:filmId. */
export type TCreateCommentRequest = {
  title: string;
  text: string;
};

/** Параметры получения комментариев фильма (filmId + пагинация). */
export type TGetFilmCommentsRequest = {
  filmId: number;
  page?: number;
  perPage?: number;
};

/** RMQ-запрос getCommentsByFilmId (userId из JWT на gateway). */
export type TGetFilmCommentsRpcRequest = TGetFilmCommentsRequest & {
  userId?: number;
};

/** RMQ-запрос createComment. */
export type TCreateCommentRpcRequest = {
  userId: number;
  filmId: number;
  authorName: string;
  dto: TCreateCommentRequest;
};

/** RMQ-запрос toggleCommentLike. */
export type TToggleCommentLikeRequest = {
  userId: number;
  commentId: number;
};
