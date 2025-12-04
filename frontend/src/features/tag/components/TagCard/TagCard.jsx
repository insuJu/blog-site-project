import { Link } from 'react-router-dom';
import styles from './TagCard.module.css';

const TagCard = ({ tag }) => {
  return (
    <Link to={`/posts?tag=${tag.name}`} className={styles.tagCard}>
      <div className={styles.tagName}>#{tag.name}</div>
      <div className={styles.tagDate}>
        {new Date(tag.createdAt).toLocaleDateString('ko-KR')}
      </div>
    </Link>
  );
};

export default TagCard;
