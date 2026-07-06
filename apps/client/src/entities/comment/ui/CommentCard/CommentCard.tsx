import type { TComment } from "../../model";

import styles from "./CommentCard.module.scss";
import { formatCommentDate } from "../../lib/formatCommentDate";
import { SvgIcon } from "@/shared/ui";



type TCommentCardProps = {
  comment: TComment;
}

export const CommentCard = ({ comment }: TCommentCardProps) => {
  return (
    <article className={styles.card}>
      <div className={styles.content}>
        <h3 className={styles.title}>
          {comment.header}
        </h3>

        <p className={styles.text}>
          {comment.value}
        </p>
      </div>

      <footer className={styles.footer}>
        <time className={styles.date}>
          {formatCommentDate(comment.createdAt)}
        </time>

        <div className={styles.likes}>
          <SvgIcon
            color="gray"
            name="like"
            size="18"
          />

          <span className={styles.likesCount}>
            0
          </span>

          <SvgIcon
            color="gray"
            name="dislike"
            size="18"
          />
        </div>
      </footer>
    </article>
  );
};