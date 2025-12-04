import { Link, useNavigate } from 'react-router-dom';
import { formatDate } from '../../../../utils/dateFormat';
import { getPreview } from '../../../../utils/textUtils';
import styles from './PostCard.module.css';

const PostCard = ({ post }) => {
  const navigate = useNavigate();

  return (
    <article className={styles.card}>
      <Link to={`/posts/${post.id}`} className={styles.cardLink} onClick={() => navigate(`/posts/${post.id}`)}>
        {post.category && (
          <span className={styles.category}>{post.category.name}</span>
        )}

        <h2 className={styles.title}>{post.title}</h2>

        <p className={styles.preview}>{getPreview(post.content)}</p>

        {post.tags && post.tags.length > 0 && (
          <div className={styles.tags}>
            {(() => {
              const unique = Array.from(new Map((post.tags || []).map(t => [t.name, t])).values());
              return unique.map((tag) => (
                <span key={tag.id} className={styles.tag}>
                  #{tag.name}
                </span>
              ));
            })()}
          </div>
        )}

        <div className={styles.meta}>
          <span className={styles.author}>{post.author.nickname}</span>
          <span className={styles.separator}>·</span>
          <span className={styles.date}>{formatDate(post.createdAt)}</span>
          <span className={styles.separator}>·</span>
          <span className={styles.stats}>
            조회 {post.viewCount} · 댓글 {post.comment.count || 0}
          </span>
        </div>
      </Link>
    </article>
  );
};

export default PostCard;
