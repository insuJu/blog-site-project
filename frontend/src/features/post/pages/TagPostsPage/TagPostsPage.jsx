import { useParams, useNavigate } from "react-router-dom";
import { usePosts } from "../../hooks/usePosts";
import PostGridList from "../../components/PostList/PostGridList";
import styles from "./TagPostsPage.module.css";

const TagPostsPage = () => {
  const { tagName } = useParams();
  const navigate = useNavigate();
  const { posts: postsData, loading, error } = usePosts({ type: 'tag', tagName });
  const posts = postsData?.content || postsData || [];

  return (
    <div className={styles.tagPostsPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <button className={styles.backButton} onClick={() => navigate(-1)}>
            ← 뒤로가기
          </button>
          <h1 className={styles.title}>
            <span className={styles.tagSymbol}>#</span>
            {tagName}
          </h1>
          <p className={styles.subtitle}>
            {loading ? '...' : `${posts.length}개의 게시글`}
          </p>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            <p>{error}</p>
          </div>
        )}

        <PostGridList posts={posts} loading={loading} />

        {!loading && posts.length === 0 && !error && (
          <div className={styles.emptyMessage}>
            <p>이 태그에 해당하는 게시글이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TagPostsPage;
