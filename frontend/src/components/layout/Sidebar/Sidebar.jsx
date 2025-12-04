import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStats } from "../../../features/stat/hooks/useStats";
import { useTags } from "../../../features/tag/hooks/useTags";
import styles from "./Sidebar.module.css";

const Sidebar = ({
  categories = [],
  onCategorySelect,
  selectedCategory = "all",
}) => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [popularTags, setPopularTags] = useState([]);
  const { stats } = useStats();
  const { tags } = useTags(8);

  useEffect(() => {
    setPopularTags(tags || []);
  }, [tags]);

  const handleCategoryClick = (categoryId) => {
    if (onCategorySelect) {
      onCategorySelect(categoryId);
    }
  };

  return (
    <aside
      className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""}`}
    >
      <div className={styles.sidebarContent}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>카테고리</h3>
          <ul className={styles.categoryList}>
            {categories.map((category) => (
              <li key={category.id} className={styles.categoryItem}>
                <button
                  className={`${styles.categoryButton} ${
                    selectedCategory === category.id ? styles.active : ""
                  }`}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <span className={styles.categoryName}>{category.name}</span>
                  {category.count !== undefined && (
                    <span className={styles.categoryCount}>
                      {category.count}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>인기 태그</h3>
          <div className={styles.tagCloud}>
            {popularTags.map((tag) => (
              <button
                key={tag.id}
                className={styles.tagButton}
                onClick={() => navigate(`/tags/${tag.name}`)}
              >
                #{tag.name}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>최근 활동</h3>
          <ul className={styles.activityList}>
            <li className={styles.activityItem}>
              <span className={styles.activityIcon}>📝</span>
              <span className={styles.activityText}>
                새 글 {stats?.postCount ?? 0}개
              </span>
            </li>
            <li className={styles.activityItem}>
              <span className={styles.activityIcon}>💬</span>
              <span className={styles.activityText}>
                댓글 {stats?.commentCount ?? 0}개
              </span>
            </li>
            <li className={styles.activityItem}>
              <span className={styles.activityIcon}>👁</span>
              <span className={styles.activityText}>
                조회수 {stats?.viewCount ?? 0}개
              </span>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
