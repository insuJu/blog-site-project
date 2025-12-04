import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PostEditor from '../../components/PostEditor/PostEditor';
import { usePost } from '../../hooks/usePost';
import styles from './EditPage.module.css';

const EditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { post, loading, error, update, reload } = usePost(id);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    reload();
  }, [id]);

  useEffect(() => {
    if (post) {
      const editorData = {
        title: post.title,
        content: post.content,
        categoryId: post.category?.id || '',
        tags: post.tags?.map(tag => `#${tag.name}`).join(' ') || '',
        isPublic: post.isPublic !== undefined ? post.isPublic : true,
      };
      setInitialData(editorData);
    }
  }, [post]);

  const handleSubmit = async (formData) => {
    const tagNames = [];
    if (formData.tags) {
      const hashMatches = [...formData.tags.matchAll(/#([^\s#,]+)/g)].map(m => m[1].trim()).filter(Boolean);
      if (hashMatches.length > 0) {
        tagNames.push(...hashMatches);
      } else {
        tagNames.push(...formData.tags.split(',').map(t => t.trim()).filter(Boolean));
      }
    }

    const payload = {
      title: formData.title,
      content: formData.content,
      categoryId: formData.categoryId ? Number(formData.categoryId) : null,
      tagNames,
      isPublic: formData.isPublic === undefined ? true : !!formData.isPublic
    };

    const result = await update(id, payload);
    if (result.success) {
      navigate(`/posts/${id}`);
    } else {
      throw new Error('게시글 수정에 실패했습니다.');
    }
  };

  if (loading || !initialData) {
    return (
      <div className={styles.editPage}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>게시글을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className={styles.editPage}>
        <div className={styles.errorContainer}>
          <h2>{error || '게시글을 찾을 수 없습니다.'}</h2>
          <button onClick={() => navigate(-1)}>돌아가기</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.editPage}>
      <div className={styles.container}>
        <PostEditor
          onSubmit={handleSubmit}
          initialData={initialData}
          isEditing={true}
        />
      </div>
    </div>
  );
};

export default EditPage;
