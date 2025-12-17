import { useNavigate } from 'react-router-dom';
import { useLikeManage } from '../../hooks/useLikeManage';
import styles from './LikeManagement.module.css';

const LikeManagement = () => {
  const { likes, loading } = useLikeManage();
  const navigate = useNavigate();

  const handleLikeClick = (postId) => {
    navigate(`/posts/${postId}`);
  };

  return (
    <div className={styles["like-management"]}>
      <div className={styles.section}>
        <h2 className={styles["section-title"]}>내 좋아요 목록 <span className={styles["count-badge"]}>{likes.length}</span></h2>

        {loading ? (
          <div className={styles.loading}>로딩 중...</div>
        ) : likes.length === 0 ? (
          <div className={styles.empty}>좋아요를 누른 항목이 없습니다.</div>
        ) : (
          <div className={styles["like-list"]}>
            {likes.map((like) => (
              <div
                key={`${like.type}-${like.id}`}
                className={styles["like-item"]}
                onClick={() => handleLikeClick(like.postId)}
              >
                <div className={styles["like-info"]}>
                  <div className={styles["like-header"]}>
                    <span className={styles["like-type-badge"]}>
                      {like.type === 'POST' ? '게시글' : '댓글'}
                    </span>
                    <div className={styles["like-title"]}>
                      {like.type === 'POST' ? like.postTitle : like.targetTitle}
                    </div>
                  </div>
                  <div className={styles["like-meta"]}>
                    {like.type === 'COMMENT' && <span>게시글: {like.postTitle}</span>}
                    <span>{new Date(like.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LikeManagement;
