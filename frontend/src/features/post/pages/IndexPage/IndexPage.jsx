import { usePosts } from "../../hooks/usePosts";
import PostGridList from "../../components/PostList/PostGridList";
import styles from "./IndexPage.module.css";

const IndexPage = () => {
  const { posts: postsData, loading } = usePosts({ type: 'all' });
  const posts = postsData?.content || postsData || [];

  return (
    <div className={styles.indexPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.subtitle}>
            다양한 사용자들이 공유하는 개발, 일상, 여행 이야기
          </p>
        </div>

        <PostGridList posts={posts} loading={loading} />
      </div>
    </div>
  );
};

export default IndexPage;
