import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PostList from "../../components/PostList/PostList";
import { usePosts } from "../../hooks/usePosts";
import styles from "./TagPostsPage.module.css";

const TagPostsPage = () => {
  const { tagName } = useParams();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [tagName]);

  const { posts: pagedPostsData, loading } = usePosts({
    type: "tag",
    tagName: tagName,
    params: { page: currentPage - 1 },
  });

  return (
    <div className={styles.tagPostsPage}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            <span className={styles.tagPrefix}>#</span>
            {tagName}
          </h1>
          <p className={styles.count}>
            총 {pagedPostsData?.totalElements || 0}개의 포스트
          </p>
        </header>

        <PostList
          posts={pagedPostsData || {}}
          loading={loading}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default TagPostsPage;