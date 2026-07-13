import type { TCommentResponse } from '@common/types';

export type TCommentCardProps = {
  comment: TCommentResponse;
  isLikePending?: boolean;
  onLikeClick?: (commentId: number) => void;
};
