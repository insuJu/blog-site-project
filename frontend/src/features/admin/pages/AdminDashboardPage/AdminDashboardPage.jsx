import { useState } from 'react';
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import AdminAccountManagement from '../../components/AdminAccountManagement/AdminAccountManagement';
import AdminPostManagement from '../../components/AdminPostManagement/AdminPostManagement';
import AdminCommentManagement from '../../components/AdminCommentManagement/AdminCommentManagement';
import AdminCategoryManagement from '../../components/AdminCategoryManagement/AdminCategoryManagement';
import AdminTagManagement from '../../components/AdminTagManagement/AdminTagManagement';
import styles from './AdminDashboardPage.module.css';

const TABS = [
  { id: 'account', label: '계정 관리' },
  { id: 'post', label: '게시글 관리' },
  { id: 'comment', label: '댓글 관리' },
  { id: 'category', label: '카테고리 관리' },
  { id: 'tag', label: '태그 관리' },
];

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return <AdminAccountManagement setSuccessMessage={setSuccessMessage} setErrorMessage={setErrorMessage} />;
      case 'post':
        return <AdminPostManagement setSuccessMessage={setSuccessMessage} setErrorMessage={setErrorMessage} />;
      case 'comment':
        return <AdminCommentManagement setSuccessMessage={setSuccessMessage} setErrorMessage={setErrorMessage} />;
      case 'category':
        return <AdminCategoryManagement setSuccessMessage={setSuccessMessage} setErrorMessage={setErrorMessage} />;
      case 'tag':
        return <AdminTagManagement setSuccessMessage={setSuccessMessage} setErrorMessage={setErrorMessage} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles["admin-page"]}>
      <div className={styles.container}>
        <h1 className={styles.title}>관리자 대시보드</h1>

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

export default AdminDashboardPage;
