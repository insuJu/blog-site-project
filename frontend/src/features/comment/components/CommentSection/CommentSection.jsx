import { useState } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { useComment } from '../../hooks/useComment';
import { useLike } from '../../../like/hooks/useLike';
import CommentForm from '../CommentForm/CommentForm';
import CommentItem from '../CommentItem/CommentItem';
import styles from './CommentSection.module.css';

const CommentSection = ({ postId, comments: commentsHook, postAuthorId }) => {
  const { user } = useAuth();
  const { create, remove } = useComment(postId);
  const { toggle: toggleCommentLike } = useLike('comment');

  const [replyingTo, setReplyingTo] = useState(null);
  const [commentFormData, setCommentFormData] = useState({ content: '', isPublic: true });
  const [commentErrors, setCommentErrors] = useState({});
  const [replyFormData, setReplyFormData] = useState({ content: '', isPublic: true });
  const [replyErrors, setReplyErrors] = useState({});

  const handleCommentChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCommentFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (commentErrors[name]) {
      setCommentErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleReplyChange = (e) => {
    const { name, value, type, checked } = e.target;
    setReplyFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (replyErrors[name]) {
      setReplyErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmitComment = async () => {
    if (!commentFormData.content.trim()) {
      setCommentErrors({ content: '댓글 내용을 입력해주세요.' });
      return;
    }

    const result = await create({
      content: commentFormData.content,
      parentId: null,
      isPublic: commentFormData.isPublic
    });

    if (result.success) {
      setCommentFormData({ content: '', isPublic: true });
      setCommentErrors({});
      await commentsHook.reload();
    } else {
      setCommentErrors(result.errors || {});
    }
  };

  const handleSubmitReply = async (commentId) => {
    if (!replyFormData.content.trim()) {
      setReplyErrors({ content: '댓글 내용을 입력해주세요.' });
      return;
    }

    const result = await create({
      content: replyFormData.content,
      parentId: commentId,
      isPublic: replyFormData.isPublic
    });

    if (result.success) {
      setReplyFormData({ content: '', isPublic: true });
      setReplyErrors({});
      setReplyingTo(null);
      await commentsHook.reload();
    } else {
      setReplyErrors(result.errors || {});
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;

    const success = await remove(commentId);
    if (success) {
      await commentsHook.reload();
    }
  };

  const handleToggleLike = async (commentId) => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    await toggleCommentLike(commentId);
    await commentsHook.reload();
  };

  const handleReply = (commentId) => {
    setReplyingTo(commentId);
    setReplyFormData({ content: '', isPublic: true });
    setReplyErrors({});
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyFormData({ content: '', isPublic: true });
    setReplyErrors({});
  };

  if (commentsHook.loading) {
    return (
      <section className={styles.commentSection}>
        <h2 className={styles.title}>댓글</h2>
        <div className={styles.empty}>댓글을 불러오는 중...</div>
      </section>
    );
  }

  const commentList = commentsHook.comments || [];

  return (
    <section className={styles.commentSection}>
      <h2 className={styles.title}>
        댓글 <span className={styles.count}>{commentList.length}</span>
      </h2>

      <div className={styles.commentFormWrapper}>
        <CommentForm
          formData={commentFormData}
          errors={commentErrors}
          onChange={handleCommentChange}
          onSubmit={handleSubmitComment}
          isAuthenticated={!!user}
          placeholder="댓글을 작성해주세요..."
          submitText="댓글 작성"
          rows={3}
        />
      </div>

      <div className={styles.commentList}>
        {commentList.length === 0 ? (
          <div className={styles.empty}>첫 댓글을 작성해보세요!</div>
        ) : (
          commentList.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUser={user}
              postAuthorId={postAuthorId}
              commentActions={{
                onDelete: handleDeleteComment,
                onLike: handleToggleLike,
                onReply: handleReply
              }}
              replyState={{
                replyingTo,
                replyFormData,
                replyErrors,
                onReplyChange: handleReplyChange,
                onSubmitReply: handleSubmitReply,
                onCancelReply: handleCancelReply
              }}
              replyActions={{
                onDeleteReply: (commentId, replyId) => handleDeleteComment(replyId),
                onLikeReply: (commentId, replyId) => handleToggleLike(replyId)
              }}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default CommentSection;
