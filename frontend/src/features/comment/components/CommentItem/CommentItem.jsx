import { IoIosHeart } from 'react-icons/io';
import { formatRelativeDate } from '../../../../utils/dateFormat';
import CommentForm from '../CommentForm/CommentForm';
import ReplyItem from '../ReplyItem/ReplyItem';
import styles from './CommentItem.module.css';

const CommentItem = ({
  comment,
  currentUser,
  postAuthorId,
  commentActions: { onDelete, onLike, onReply },
  replyState: {
    replyingTo,
    replyFormData,
    replyErrors,
    onReplyChange,
    onSubmitReply,
    onCancelReply
  },
  replyActions: { onDeleteReply, onLikeReply }
}) => {
  const isAuthor = currentUser && currentUser.id === comment.author.id;
  const isPostAuthor = currentUser && currentUser.id === postAuthorId;
  const canSeePrivate = isAuthor || isPostAuthor;

  return (
    <div className={styles.commentItem}>
      <div className={styles.comment}>
        <div className={styles.avatar}>{comment.author.nickname.charAt(0)}</div>
        <div className={styles.commentContent}>
          <div className={styles.commentHeader}>
            <span className={styles.author}>{comment.author.nickname}</span>
            <span className={styles.date}>{formatRelativeDate(comment.createdAt)}</span>
            {!comment.isPublic && canSeePrivate && (
              <span className={styles.privateBadge}>비공개</span>
            )}
          </div>
          <p className={styles.text}>{comment.content}</p>
          <div className={styles.commentActions}>
            <button
              className={`${styles.likeButton} ${
                comment.liked ? styles.liked : ""
              }`}
              onClick={() => onLike(comment.id)}
            >
              <IoIosHeart /> {comment.likeCount}
            </button>
            <button
              className={styles.replyButton}
              onClick={() => onReply(comment.id)}
            >
              답글
            </button>
            {isAuthor && (
              <button
                className={styles.deleteButton}
                onClick={() => onDelete(comment.id)}
              >
                삭제
              </button>
            )}
          </div>
        </div>
      </div>

      {replyingTo === comment.id && (
        <div className={styles.replyForm}>
          <CommentForm
            formData={replyFormData}
            errors={replyErrors}
            onChange={onReplyChange}
            onSubmit={() => onSubmitReply(comment.id)}
            onCancel={onCancelReply}
            isAuthenticated={!!currentUser}
            placeholder="답글을 작성해주세요..."
            submitText="답글 작성"
            rows={2}
            isReply={true}
          />
        </div>
      )}

      {comment.children && comment.children.length > 0 && (
        <div className={styles.replies}>
          {comment.children.map((reply) => (
            <ReplyItem
              key={reply.id}
              reply={reply}
              currentUser={currentUser}
              postAuthorId={postAuthorId}
              onDelete={() => onDeleteReply(comment.id, reply.id)}
              onLike={() => onLikeReply(comment.id, reply.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
