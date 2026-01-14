import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../../../components/layout/Sidebar/Sidebar";
import { useCategories } from "../../../category/hooks/useCategories";
import { getUserInfo } from "../../../settings/api/accountApi";
import PostList from "../../components/PostList/PostList";
import { usePosts } from "../../hooks/usePosts";
import styles from "./UserBlogPage.module.css";

const UserBlogPage = () => {
  const { userId } = useParams();
  const { posts: postsData, loading } = usePosts({
    type: "author",
    authorId: userId,
  });
  const { categories: categoriesData } = useCategories(userId);

  const allPosts = postsData?.content || postsData || [];
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    postCount: 0,
    commentCount: 0,
    viewCount: 0,
  });
  const [blogOwner, setBlogOwner] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await getUserInfo(userId);
        if (response.data.data?.profile) {
          setBlogOwner({
            id: response.data.id,
            nickname: response.data.data.profile.nickname,
            blogName: response.data.data.profile.blogName,
            avatar: response.data.data.profile.avatar
          });
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };

    if (userId) {
      fetchUserInfo();
    }
  }, [userId]);

  const flattenCategories = (cats, depth = 0, out = []) => {
    (cats || []).forEach((c) => {
      out.push({ ...c, depth });
      if (c.children && c.children.length > 0) {
        flattenCategories(c.children, depth + 1, out);
      }
    });
    return out;
  };

  const getAllDescendantIds = (categoryId, categoriesData) => {
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

    const category = findCategory(categoriesData, categoryId);
    if (category && category.children) {
      category.children.forEach((child) => {
        ids.push(...getAllDescendantIds(child.id, categoriesData));
      });
    }

    return ids;
  };

  useEffect(() => {
    const flatCategories = flattenCategories(categoriesData);

    const uncategorizedCount = allPosts.filter(post => !post.category?.id).length;

    const categoryList = [
      { id: "all", name: "전체", count: allPosts.length },
      ...flatCategories.map((cat) => {
        const descendantIds = getAllDescendantIds(cat.id, categoriesData);
        const count = allPosts.filter((post) =>
          post.category?.id && descendantIds.includes(post.category.id)
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
    } else if (selectedCategory === "uncategorized") {
      setPosts(allPosts.filter((post) => !post.category?.id));
    } else {
      const descendantIds = getAllDescendantIds(selectedCategory, categoriesData);
      setPosts(
        allPosts.filter((post) => post.category?.id && descendantIds.includes(post.category.id))
      );
    }
  }, [selectedCategory, allPosts, categoriesData]);

  return (
    <div className={styles.userBlogPage}>
      <Sidebar
        categories={categories}
        onCategorySelect={setSelectedCategory}
        selectedCategory={selectedCategory}
        accountId={userId}
      />

      <div className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.profileHeader}>
            <div className={styles.profileInfo}>
              <div className={styles.avatar}>
                {blogOwner?.avatar ? (
                  <img
                    src={blogOwner.avatar}
                    alt={blogOwner.nickname}
                    className={styles.avatarImage}
                  />
                ) : (
                  blogOwner?.nickname?.charAt(0) || "U"
                )}
              </div>
              <div className={styles.userInfo}>
                <h1 className={styles.nickname}>
                  {blogOwner?.nickname || "사용자"}
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
            <h2 className={styles.sectionTitle}>
              {blogOwner?.nickname || "사용자"}님의 게시글
            </h2>
            <PostList posts={posts} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBlogPage;
