import PostGridCard from '../PostCard/PostGridCard';
import styles from './PostGridList.module.css';

const PostGridList = ({ posts = {}, loading = false, currentPage = 1, onPageChange }) => {
  const currentPosts = posts.content || [];
  const totalPages = posts.totalPages || 1;

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>게시글을 불러오는 중...</p>
      </div>
    );
  }

  if (currentPosts.length === 0) {
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

      {totalPages > 1 && onPageChange && (
        <div className={styles.pagination}>
          <button 
            className={styles.pageButton}
            onClick={() => { onPageChange(currentPage - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
            disabled={currentPage === 1}
          >
            이전
          </button>
          
          {[...Array(totalPages)].map((_, i) => {
            const pageNumber = i + 1;
            return (
              <button 
                key={pageNumber} 
                className={`${styles.pageButton} ${currentPage === pageNumber ? styles.active : ''}`}
                onClick={() => { onPageChange(pageNumber); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              >
                {pageNumber}
              </button>
            );
          })}
          
          <button 
            className={styles.pageButton}
            onClick={() => { onPageChange(currentPage + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
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