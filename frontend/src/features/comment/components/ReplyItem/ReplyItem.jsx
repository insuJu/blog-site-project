import { Link } from 'react-router-dom';
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
  const authorBlogUrl = isReplyAuthor ? '/my-blog' : `/users/${reply.author.id}/blog`;

  return (
    <div className={styles.reply}>
      <Link
        to={authorBlogUrl}
        className={styles.avatar}
      >
        {reply.author.avatar ? (
          <img src={reply.author.avatar} alt={reply.author.nickname} className={styles.avatarImage} />
        ) : (
          reply.author.nickname.charAt(0)
        )}
      </Link>
      <div className={styles.replyContent}>
        <div className={styles.replyHeader}>
          <Link
            to={authorBlogUrl}
            className={styles.author}
          >
            {reply.author.nickname}
          </Link>
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
