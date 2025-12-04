import { useState, useEffect } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import { usePosts } from "../../hooks/usePosts";
import { useCategories } from "../../../category/hooks/useCategories";
import PostList from "../../components/PostList/PostList";
import Sidebar from "../../../../components/layout/Sidebar/Sidebar";
import styles from "./MyBlogPage.module.css";

const MyBlogPage = () => {
  const { user } = useAuth();
  const { posts: postsData, loading } = usePosts({
    type: 'author',
    authorId: user?.id
  });
  const { categories: categoriesData } = useCategories();

  const allPosts = postsData?.content || postsData || [];
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    postCount: 0,
    commentCount: 0,
    viewCount: 0,
  });

  useEffect(() => {
    const postsByCategory = {};
    allPosts.forEach((post) => {
      const categoryName = post.category?.name || "기타";
      postsByCategory[categoryName] =
        (postsByCategory[categoryName] || 0) + 1;
    });

    const categoryList = [
      { id: "all", name: "전체", count: allPosts.length },
      ...(categoriesData || []).map((cat) => ({
        id: cat.id,
        name: cat.name,
        count: postsByCategory[cat.name] || 0,
      })),
    ];

    setCategories(categoryList);
  }, [allPosts, categoriesData]);

  useEffect(() => {
    const totalPosts = allPosts.length;
    const totalComments = allPosts.reduce(
      (sum, post) => sum + (post.commentCount || 0),
      0
    );
    const totalViews = allPosts.reduce(
      (sum, post) => sum + (post.viewCount || 0),
      0
    );

    setStats({
      postCount: totalPosts,
      commentCount: totalComments,
      viewCount: totalViews,
    });
  }, [allPosts]);

  useEffect(() => {
    if (selectedCategory === "all") {
      setPosts(allPosts);
    } else {
      setPosts(
        allPosts.filter((post) => post.category?.name === selectedCategory)
      );
    }
  }, [selectedCategory, allPosts]);

  return (
    <div className={styles.myBlogPage}>
      <Sidebar
        categories={categories}
        onCategorySelect={setSelectedCategory}
        selectedCategory={selectedCategory}
      />

      <div className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.profileHeader}>
            <div className={styles.profileInfo}>
              <div className={styles.avatar}>
                {user?.nickname ? user.nickname.charAt(0) : "U"}
              </div>
              <div className={styles.userInfo}>
                <h1 className={styles.nickname}>
                  {user?.nickname || "닉네임"}
                </h1>
                <p className={styles.bio}>개발과 일상을 기록하는 공간입니다.</p>
              </div>
            </div>
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <span className={styles.statValue}>{stats.postCount}</span>
                <span className={styles.statLabel}>게시글</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>{stats.commentCount}</span>
                <span className={styles.statLabel}>댓글</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>{stats.viewCount}</span>
                <span className={styles.statLabel}>조회수</span>
              </div>
            </div>
          </div>

          <div className={styles.categoryFilter}>
            {categories.map((category) => (
              <button
                key={category.id}
                className={`${styles.categoryButton} ${
                  selectedCategory === category.id ? styles.active : ""
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className={styles.postsSection}>
            <h2 className={styles.sectionTitle}>내 게시글</h2>
            <PostList posts={posts} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBlogPage;
