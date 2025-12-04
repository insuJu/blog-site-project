import TagCard from '../../components/TagCard/TagCard';
import { useTags } from '../../hooks/useTags';
import styles from './TagListPage.module.css';

const TagListPage = () => {
  const { tags, loading, error } = useTags(Infinity);

  if (loading) {
    return (
      <div className={styles.tagListPage}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>태그를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.tagListPage}>
        <div className={styles.container}>
          <div className={styles.error}>
            <p>태그를 불러오는데 실패했습니다.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.tagListPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.mainTitle}>태그</h1>
          <p className={styles.subtitle}>
            총 {tags.length}개의 태그가 있습니다
          </p>
        </div>

        <div className={styles.tagGrid}>
          {tags.map((tag) => (
            <TagCard key={tag.id} tag={tag} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TagListPage;
