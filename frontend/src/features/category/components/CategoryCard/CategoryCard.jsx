import { Link } from 'react-router-dom';
import styles from './CategoryCard.module.css';

const CategoryCard = ({ category }) => {
  const { id, name, description, postCount, icon } = category;

  return (
    <Link to={`/categories/${id}`} className={styles.card}>
      <div className={styles.iconWrapper}>
        <span className={styles.icon}>{icon}</span>
      </div>
      <div className={styles.content}>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.description}>{description}</p>
        <span className={styles.postCount}>
          {postCount}개의 게시글
        </span>
      </div>
    </Link>
  );
};

export default CategoryCard;
