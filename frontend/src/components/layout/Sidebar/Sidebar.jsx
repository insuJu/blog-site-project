import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaFileAlt, FaEye, FaHistory, FaCommentDots } from "react-icons/fa";
import { useAuth } from "../../../contexts/AuthContext";
import { getAuthorStats } from "../../../features/stat/api/statsApi";
import { useTags } from "../../../features/tag/hooks/useTags";
import { getPostsByAuthor } from "../../../features/post/api/postApi";
import { getCommentsByAuthorId } from "../../../features/comment/api/commentApi";
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
    viewCount: 0,
  });

  const [latestPosts, setLatestPosts] = useState([]);
  const [latestComments, setLatestComments] = useState([]);

  useEffect(() => {
    setPopularTags(tags || []);
  }, [tags]);

  useEffect(() => {
    const fetchData = async () => {
      if (!accountId) return;
      
      try {
        const statsData = await getAuthorStats(accountId);
        setAuthorStats({
          postCount: statsData.postCount,
          viewCount: statsData.viewCount,
        });

        const postsData = await getPostsByAuthor(accountId, { size: 5 });
        setLatestPosts(postsData.content || []);

        const commentsData = await getCommentsByAuthorId(accountId);
        setLatestComments((commentsData || []).slice(0, 5));
        
      } catch (error) {
        console.error("Failed to fetch sidebar data:", error);
      }
    };

    fetchData();
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
        {accountId && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>블로그 정보</h3>
            <ul className={styles.activityList}>
              <li className={styles.activityItem}>
                <FaFileAlt className={styles.activityIcon} />
                <span className={styles.activityText}>
                  전체 글 {authorStats.postCount}개
                </span>
              </li>
              <li className={styles.activityItem}>
                <FaEye className={styles.activityIcon} />
                <span className={styles.activityText}>
                  총 조회수 {authorStats.viewCount}회
                </span>
              </li>
            </ul>
          </div>
        )}

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>카테고리</h3>
          <ul className={styles.categoryList}>
            <li className={styles.categoryItem}>
              <button
                className={`${styles.categoryButton} ${
                  selectedCategory === "all" ? styles.active : ""
                }`}
                onClick={() => handleCategoryClick("all")}
              >
                <span className={styles.categoryName}>전체보기</span>
              </button>
            </li>
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
          <h3 className={styles.sectionTitle}>
            <FaHistory className={styles.titleIcon} /> 최신 게시글
          </h3>
          <ul className={styles.latestList}>
            {latestPosts.map((post) => (
              <li key={post.id} className={styles.latestItem}>
                <Link to={`/posts/${post.id}`} className={styles.latestLink}>
                  {post.title}
                </Link>
              </li>
            ))}
            {latestPosts.length === 0 && <li className={styles.emptyText}>게시글이 없습니다.</li>}
          </ul>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <FaCommentDots className={styles.titleIcon} /> 최신 댓글
          </h3>
          <ul className={styles.latestList}>
            {latestComments.map((comment) => (
              <li key={comment.id} className={styles.latestItem}>
                <Link to={`/posts/${comment.postId}`} className={styles.latestLink}>
                  <span className={styles.commentPreview}>{comment.content}</span>
                  <span className={styles.commentAuthor}>- {comment.authorNickname}</span>
                </Link>
              </li>
            ))}
            {latestComments.length === 0 && <li className={styles.emptyText}>댓글이 없습니다.</li>}
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
