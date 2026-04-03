import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import { usePosts } from "../../hooks/usePosts";
import { useCategories } from "../../../category/hooks/useCategories";
import PostList from "../../components/PostList/PostList";
import Sidebar from "../../../../components/layout/Sidebar/Sidebar";
import styles from "./MyBlogPage.module.css";

const MyBlogPage = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { categories: categoriesData } = useCategories();

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const getAllDescendantIds = useCallback((categoryId, catsData) => {
    const ids = [categoryId];

    const findCategory = (cats, id) => {
      for (const cat of cats) {
        if (cat.id === id) return cat;
        if (cat.children) {
          const found = findCategory(cat.children, id);
          if (found) return found;
        }
      }
      return null;
    };

    const category = findCategory(catsData, categoryId);
    if (category && category.children) {
      category.children.forEach((child) => {
        ids.push(...getAllDescendantIds(child.id, catsData));
      });
    }

    return ids;
  }, []);

  const categoryParam = useMemo(() => {
    if (selectedCategory === "all") return "all";
    if (selectedCategory === "uncategorized") return "uncategorized";
    return getAllDescendantIds(selectedCategory, categoriesData).join(",");
  }, [selectedCategory, categoriesData, getAllDescendantIds]);

  const { posts: pagedPostsData, loading } = usePosts({
    type: "author",
    authorId: user?.id,
    params: { 
      page: currentPage - 1,
      category: categoryParam
    },
  });

  const { posts: unpagedPostsData } = usePosts({
    type: "author-unpaged",
    authorId: user?.id,
  });

  const allPosts = unpagedPostsData || [];

  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    postCount: 0,
    commentCount: 0,
    viewCount: 0,
  });

  const flattenCategories = (cats, depth = 0, out = []) => {
    (cats || []).forEach((c) => {
      out.push({ ...c, depth });
      if (c.children && c.children.length > 0) {
        flattenCategories(c.children, depth + 1, out);
      }
    });
    return out;
  };

  useEffect(() => {
    const flatCategories = flattenCategories(categoriesData);

    const uncategorizedCount = allPosts.filter((post) => !post.category?.id).length;

    const categoryList = [
      { id: "all", name: "전체", count: allPosts.length },
      ...flatCategories.map((cat) => {
        const catDescendantIds = getAllDescendantIds(cat.id, categoriesData);
        const count = allPosts.filter((post) =>
          post.category?.id && catDescendantIds.includes(post.category.id)
        ).length;

        return {
          id: cat.id,
          name: cat.name,
          depth: cat.depth,
          count: count,
          children: cat.children,
        };
      }),
    ];

    if (uncategorizedCount > 0) {
      categoryList.push({
        id: "uncategorized",
        name: "미분류",
        depth: 0,
        count: uncategorizedCount,
      });
    }

    setCategories(categoryList);
  }, [allPosts, categoriesData, getAllDescendantIds]);

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

  return (
    <div className={styles.myBlogPage}>
      <Sidebar
        categories={categories}
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory}
        accountId={user?.id}
        isMyBlogPage={true}
      />

      <div className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.profileHeader}>
            <div className={styles.profileInfo}>
              <div className={styles.avatar}>
                {user.profile?.avatar ? (
                  <img
                    src={user.profile.avatar}
                    alt={user.profile.nickname}
                    className={styles.avatarImage}
                  />
                ) : (
                  user.profile.nickname.charAt(0)
                )}
              </div>
              <div className={styles.userInfo}>
                <h1 className={styles.nickname}>
                  {user.profile?.nickname || "닉네임"}
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
                onClick={() => handleCategorySelect(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className={styles.postsSection}>
            <h2 className={styles.sectionTitle}>내 게시글</h2>
            <PostList 
              posts={pagedPostsData || {}} 
              loading={loading} 
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBlogPage;