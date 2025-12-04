import { IoIosHeart } from 'react-icons/io';
import { formatRelativeDate } from '../../../../utils/dateFormat';
import styles from './ReplyItem.module.css';

const ReplyItem = ({
  reply,
  currentUser,
  postAuthorId,
  onDelete,
  onLike
}) => {
  const isReplyAuthor = currentUser && currentUser.id === reply.author.id;
  const isPostAuthor = currentUser && currentUser.id === postAuthorId;
  const canSeePrivate = isReplyAuthor || isPostAuthor;

  return (
    <div className={styles.reply}>
      <div className={styles.avatar}>
        {reply.author.nickname.charAt(0)}
      </div>
      <div className={styles.replyContent}>
        <div className={styles.replyHeader}>
          <span className={styles.author}>
            {reply.author.nickname}
          </span>
          <span className={styles.date}>
            {formatRelativeDate(reply.createdAt)}
          </span>
          {!reply.isPublic && canSeePrivate && (
            <span className={styles.privateBadge}>비공개</span>
          )}
        </div>
        <p className={styles.text}>{reply.content}</p>
        <div className={styles.replyActions}>
          <button
            className={`${styles.likeButton} ${
              reply.liked ? styles.liked : ''
            }`}
            onClick={() => onLike(reply.id)}
          >
            <IoIosHeart /> {reply.likeCount}
          </button>
          {isReplyAuthor && (
            <button
              className={styles.deleteButton}
              onClick={() => onDelete(reply.id)}
            >
              삭제
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReplyItem;
