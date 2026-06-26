import type { Comment } from "../models/comments.model";
import type {
  TCommentResponse,
  TCommentsTreeResponse,
} from "@common/types";


/**
 * Преобразует ORM-модель комментария в DTO ответа.
 */
export function mapCommentToResponse(
  comment: Comment
): TCommentResponse {
  return comment.toJSON();
}

/**
 * Строит дерево комментариев из плоского списка.
 */
export function mapCommentsToTree(
  comments: Comment[]
): TCommentsTreeResponse {
  const childrenMap = new Map<
    number,
    TCommentResponse[]
  >();

  const roots: TCommentResponse[] = [];

  for (const comment of comments) {
    const item = mapCommentToResponse(comment);

    if (item.parentId === null) {
      roots.push(item);
      continue;
    }

    const children =
      childrenMap.get(item.parentId) ?? [];

    children.push(item);

    childrenMap.set(
      item.parentId,
      children
    );
  }

  return roots.map((root) => [
    root,
    ...(childrenMap.get(root.id) ?? []),
  ]);
}