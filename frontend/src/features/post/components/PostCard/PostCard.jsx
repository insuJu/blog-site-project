import { Link, useNavigate } from 'react-router-dom';
import { formatDate } from '../../../../utils/dateFormat';
import { getPreview } from '../../../../utils/textUtils';
import styles from './PostCard.module.css';

const PostCard = ({ post }) => {
  const navigate = useNavigate();

  const goToPost = () => {
    navigate(`/posts/${post.id}`);
  };

  return (
    <article
      className={styles.card}
      onClick={goToPost}
      role="button"
      style={{ cursor: "pointer" }}
    >
      {post.category && (
        <span className={styles.category}>{post.category.name}</span>
      )}

      <h2 className={styles.title}>{post.title}</h2>

      <p className={styles.preview}>{getPreview(post.content)}</p>

      {post.tags && post.tags.length > 0 && (
        <div className={styles.tags}>
          {Array.from(new Map(post.tags.map(t => [t.name, t])).values()).map(
            (tag) => (
              <span key={tag.id} className={styles.tag}>
                #{tag.name}
              </span>
            )
          )}
        </div>
      )}

      <div className={styles.meta}>
        <Link
          to={`/users/${post.author.id}/blog`}
          className={styles.avatarLink}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.avatar}>
            {post.author.avatar ? (
              <img
                src={post.author.avatar}
                alt={post.author.nickname}
                className={styles.avatarImage}
              />
            ) : (
              post.author.nickname.charAt(0)
            )}
          </div>
        </Link>

        <Link
          to={`/users/${post.author.id}/blog`}
          className={styles.author}
          onClick={(e) => e.stopPropagation()}
        >
          {post.author.nickname}
        </Link>

        <span className={styles.separator}>·</span>
        <span className={styles.date}>{formatDate(post.createdAt)}</span>

        <span className={styles.separator}>·</span>
        <span className={styles.stats}>
          조회 {post.viewCount} · 댓글 {post.comment?.count || 0}
        </span>
      </div>
    </article>
  );
};

export default PostCard;
