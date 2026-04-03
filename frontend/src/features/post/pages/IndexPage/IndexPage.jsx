import { useState } from 'react';
import { usePosts } from "../../hooks/usePosts";
import PostGridList from "../../components/PostList/PostGridList";
import styles from "./IndexPage.module.css";

const IndexPage = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { posts, loading } = usePosts({ 
    type: 'all',
    params: { page: currentPage - 1 } 
  });

  return (
    <div className={styles.indexPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.subtitle}>
            다양한 사용자들이 공유하는 개발, 일상, 여행 이야기
          </p>
        </div>

        <PostGridList 
          posts={posts} 
          loading={loading} 
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default IndexPage;
