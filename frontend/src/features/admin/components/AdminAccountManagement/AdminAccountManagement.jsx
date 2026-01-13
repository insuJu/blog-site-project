import { useState, useEffect } from 'react';
import { useAdminAccounts } from '../../hooks/useAdminAccounts';
import styles from './AdminAccountManagement.module.css';

const AdminAccountManagement = ({ setSuccessMessage, setErrorMessage }) => {
  const { accounts, loading, error, loadAccounts, removeAccount } = useAdminAccounts();
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  const handleSelectAll = (checked) => {
    if (checked && accounts?.content) {
      setSelectedIds(accounts.content.map((acc) => acc.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id, checked) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) {
      setErrorMessage('Delete target not selected');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    if (!window.confirm(`선택한 ${selectedIds.length}개의 계정을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      for (const id of selectedIds) {
        await removeAccount(id);
      }
      setSuccessMessage(`${selectedIds.length}개의 계정이 삭제되었습니다.`);
      setSelectedIds([]);
      setTimeout(() => setSuccessMessage(''), 3000);
      loadAccounts();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to delete account');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const accountList = accounts?.content || [];
  const allSelected = accountList.length > 0 && selectedIds.length === accountList.length;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  if (error) {
    return (
      <div className={styles["admin-account-management"]}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles["admin-account-management"]}>
      <div className={styles.section}>
        <div className={styles["section-header"]}>
          <h2 className={styles["section-title"]}>
            전체 계정 목록 <span className={styles["count-badge"]}>{accountList.length}</span>
          </h2>
          <div className={styles.actions}>
            <label className={styles["select-all"]}>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className={styles.checkbox}
              />
              <span>전체 선택</span>
            </label>
            <button
              onClick={handleDelete}
              disabled={selectedIds.length === 0}
              className={styles["delete-button"]}
            >
              선택 삭제 ({selectedIds.length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className={styles.loading}>로딩 중...</div>
        ) : accountList.length === 0 ? (
          <div className={styles.empty}>계정이 없습니다.</div>
        ) : (
          <div className={styles["account-list"]}>
            {accountList.map((account) => (
              <div key={account.id} className={styles["account-item"]}>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(account.id)}
                  onChange={(e) => handleSelect(account.id, e.target.checked)}
                  className={styles.checkbox}
                />
                <div className={styles["account-info"]}>
                  <span className={styles["account-username"]}>{account.username}</span>
                  <div className={styles["account-meta"]}>
                    <span>Role: {account.roleType}</span>
                    <span>Nickname: {account.profile?.nickname || '-'}</span>
                    <span>Blog: {account.profile?.blogName || '-'}</span>
                    <span>Created: {formatDate(account.createdAt)}</span>
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

export default AdminAccountManagement;
