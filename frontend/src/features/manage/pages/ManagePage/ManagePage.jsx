import { useState } from 'react';
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import CategoryManagement from '../../components/CategoryManagement/CategoryManagement';
import TagManagement from '../../components/TagManagement/TagManagement';
import PostManagement from '../../components/PostManagement/PostManagement';
import CommentManagement from '../../components/CommentManagement/CommentManagement';
import LikeManagement from '../../components/LikeManagement/LikeManagement';
import styles from './ManagePage.module.css';

const TABS = [
  { id: 'category', label: '카테고리 관리' },
  { id: 'tag', label: '태그 관리' },
  { id: 'post', label: '게시글 관리' },
  { id: 'comment', label: '댓글 관리' },
  { id: 'like', label: '좋아요 관리' },
];

const ManagePage = () => {
  const [activeTab, setActiveTab] = useState('category');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'category':
        return <CategoryManagement setSuccessMessage={setSuccessMessage} setErrorMessage={setErrorMessage} />;
      case 'tag':
        return <TagManagement setSuccessMessage={setSuccessMessage} setErrorMessage={setErrorMessage} />;
      case 'post':
        return <PostManagement setSuccessMessage={setSuccessMessage} setErrorMessage={setErrorMessage} />;
      case 'comment':
        return <CommentManagement setSuccessMessage={setSuccessMessage} setErrorMessage={setErrorMessage} />;
      case 'like':
        return <LikeManagement setSuccessMessage={setSuccessMessage} setErrorMessage={setErrorMessage} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles["manage-page"]}>
      <div className={styles.container}>
        <h1 className={styles.title}>관리페이지</h1>

        {successMessage && (
          <div className={styles["success-message"]}>
            <FiCheckCircle size={20} />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className={styles["error-message"]}>
            <FiAlertCircle size={20} />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className={styles["tab-container"]}>
          <div className={styles["tab-list"]}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={`${styles["tab-button"]} ${
                  activeTab === tab.id ? styles.active : ''
                }`}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSuccessMessage('');
                  setErrorMessage('');
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className={styles["tab-content"]}>{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default ManagePage;
