import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaComment } from 'react-icons/fa';
import { formatDate } from '../../../../utils/dateFormat';
import { getPreview } from '../../../../utils/textUtils';
import styles from './PostGridCard.module.css';

const PostGridCard = ({ post }) => {
  const navigate = useNavigate();

  return (
    <article className={styles.gridCard}>
      <Link to={`/posts/${post.id}`} className={styles.cardLink} onClick={() => navigate(`/posts/${post.id}`)}>
        <div className={styles.cardContent}>
          {post.category && (
            <span className={styles.category}>{post.category.name}</span>
          )}

          <h3 className={styles.title}>{post.title}</h3>

          <p className={styles.preview}>{getPreview(post.content, 100)}</p>

          {post.tags && post.tags.length > 0 && (
            <div className={styles.tags}>
              {(() => {
                const unique = Array.from(new Map((post.tags || []).map(t => [t.name, t])).values());
                return unique.slice(0, 3).map((tag) => (
                  <span key={tag.id} className={styles.tag}>
                    #{tag.name}
                  </span>
                ));
              })()}
            </div>
          )}
        </div>

        <div className={styles.cardFooter}>
          <div className={styles.author}>{post.author.nickname}</div>
          <div className={styles.meta}>
            <span className={styles.date}>{formatDate(post.createdAt)}</span>
            <div className={styles.stats}>
              <span className={styles.statItem}>
                <FaEye className={styles.statIcon} /> {post.viewCount}
              </span>
              <span className={styles.statItem}>
                <FaComment className={styles.statIcon} /> {post.comment.count || 0}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default PostGridCard;
