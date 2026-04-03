import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { getAuthorStats } from "../../../features/stat/api/statsApi";
import { useTags } from "../../../features/tag/hooks/useTags";
import styles from "./Sidebar.module.css";

const Sidebar = ({
  categories = [],
  onCategorySelect,
  selectedCategory = "all",
  accountId = null,
  isMyBlogPage = false,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [popularTags, setPopularTags] = useState([]);
  const { tags } = useTags(accountId, 8);

  const [authorStats, setAuthorStats] = useState({
    postCount: 0,
    commentCount: 0,
    viewCount: 0,
  });

  useEffect(() => {
    setPopularTags(tags || []);
  }, [tags]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!accountId) return;
      try {
        const data = await getAuthorStats(accountId);
        setAuthorStats(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStats();
  }, [accountId]);

  const handleCategoryClick = (categoryId) => {
    if (onCategorySelect) {
      onCategorySelect(categoryId);
    } else {
      const path = accountId ? `/blog/${accountId}` : "/posts";
      navigate(path);
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
                  } ${category.depth > 0 ? styles.childCategory : ""}`}
                  onClick={() => handleCategoryClick(category.id)}
                  style={{ paddingLeft: `${1 + (category.depth || 0) * 1.5}rem` }}
                >
                  {category.depth > 0 && (
                    <span className={styles.categoryIndicator}>└</span>
                  )}
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

        {accountId && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>블로그 정보</h3>
            <ul className={styles.activityList}>
              <li className={styles.activityItem}>
                <span className={styles.activityIcon}>📝</span>
                <span className={styles.activityText}>
                  전체 글 {authorStats.postCount}개
                </span>
              </li>
              <li className={styles.activityItem}>
                <span className={styles.activityIcon}>💬</span>
                <span className={styles.activityText}>
                  댓글 {authorStats.commentCount}개
                </span>
              </li>
              <li className={styles.activityItem}>
                <span className={styles.activityIcon}>👁</span>
                <span className={styles.activityText}>
                  조회수 {authorStats.viewCount}회
                </span>
              </li>
            </ul>
          </div>
        )}

        {isMyBlogPage && user && user.id === Number(accountId) && (
          <div className={styles.section}>
            <Link to="/manage" className={styles.manageLink}>
              블로그 관리
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;