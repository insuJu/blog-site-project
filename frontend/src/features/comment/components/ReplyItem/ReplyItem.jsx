import { Link } from 'react-router-dom';
import { FiUser } from 'react-icons/fi';
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
  const isReplyAuthor = currentUser && reply.author.id && currentUser.id === reply.author.id;
  const isPostAuthor = currentUser && currentUser.id === postAuthorId;
  const canSeePrivate = isReplyAuthor || isPostAuthor;
  const authorBlogUrl = isReplyAuthor ? '/my-blog' : (reply.author.id ? `/users/${reply.author.id}/blog` : null);

  return (
    <div className={styles.reply}>
      <Link
        to={authorBlogUrl || '#'}
        className={styles.avatar}
        onClick={(e) => { if (!authorBlogUrl) e.preventDefault(); }}
        style={{ cursor: authorBlogUrl ? 'pointer' : 'default' }}
      >
        {reply.author.avatar ? (
          <img src={reply.author.avatar} alt={reply.author.nickname} className={styles.avatarImage} />
        ) : (
          <FiUser size={20} />
        )}
      </Link>
      <div className={styles.replyContent}>
        <div className={styles.replyHeader}>
          {authorBlogUrl ? (
            <Link
              to={authorBlogUrl}
              className={styles.author}
            >
              {reply.author.nickname}
            </Link>
          ) : (
            <span className={styles.author}>
              {reply.author.nickname}
            </span>
          )}
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
