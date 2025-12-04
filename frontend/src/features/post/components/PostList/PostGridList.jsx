import { useState } from 'react';
import PostGridCard from '../PostCard/PostGridCard';
import styles from './PostGridList.module.css';

const PostGridList = ({ posts = [], loading = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 100;

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>게시글을 불러오는 중...</p>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className={styles.empty}>
        <p>작성된 게시글이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className={styles.postGridList}>
      <div className={styles.grid}>
        {currentPosts.map((post) => (
          <PostGridCard key={post.id} post={post} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageButton}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            이전
          </button>

          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            return (
              <button
                key={pageNumber}
                className={`${styles.pageButton} ${
                  currentPage === pageNumber ? styles.active : ''
                }`}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            );
          })}

          <button
            className={styles.pageButton}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
};

export default PostGridList;
