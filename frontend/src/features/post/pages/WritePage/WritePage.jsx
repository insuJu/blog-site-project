import { useNavigate } from 'react-router-dom';
import PostEditor from '../../components/PostEditor/PostEditor';
import { usePost } from '../../hooks/usePost';
import styles from './WritePage.module.css';

const WritePage = () => {
  const navigate = useNavigate();
  const { create } = usePost();

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

    const result = await create(payload);
    if (result.success) {
      navigate('/');
    } else {
      throw new Error('게시글 생성에 실패했습니다.');
    }
  };

  return (
    <div className={styles.writePage}>
      <div className={styles.container}>
        <PostEditor onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default WritePage;
