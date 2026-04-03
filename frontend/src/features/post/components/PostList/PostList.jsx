import PostCard from "../PostCard/PostCard";
import styles from "./PostList.module.css";

const PostList = ({ posts = {}, loading = false, currentPage = 1, onPageChange }) => {
  const currentPosts = posts.content || [];
  const totalPages = posts.totalPages || 1;

  if (loading) {
    return <div className={styles.loading}>게시글을 불러오는 중입니다...</div>;
  }

  if (currentPosts.length === 0) {
    return <div className={styles.empty}>게시글이 없습니다.</div>;
  }

  return (
    <div className={styles.postListContainer}>
      <div className={styles.postList}>
        {currentPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {totalPages > 1 && onPageChange && (
        <div className={styles.pagination}>
          <button
            className={styles.pageButton}
            onClick={() => {
              onPageChange(currentPage - 1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            disabled={currentPage === 1}
          >
            이전
          </button>
          
          {[...Array(totalPages)].map((_, i) => {
            const pageNumber = i + 1;
            return (
              <button
                key={pageNumber}
                className={`${styles.pageNumber} ${currentPage === pageNumber ? styles.active : ""}`}
                onClick={() => {
                  onPageChange(pageNumber);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                {pageNumber}
              </button>
            );
          })}

          <button
            className={styles.pageButton}
            onClick={() => {
              onPageChange(currentPage + 1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            disabled={currentPage === totalPages}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
};

export default PostList;