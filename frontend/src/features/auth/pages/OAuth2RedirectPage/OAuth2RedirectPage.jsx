import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../contexts/AuthContext';
import { getCurrentUser } from '../../api/authApi';
import OAuth2TermsModal from '../../components/OAuth2TermsModal/OAuth2TermsModal';
import styles from './OAuth2RedirectPage.module.css';

const OAuth2RedirectPage = () => {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const handleOAuth2Redirect = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const error = urlParams.get('error');
      const isNewUser = urlParams.get('newUser');

      if (error) {
        console.error('OAuth2 authentication failed:', error);
        navigate('/');
        return;
      }

      try {
        const response = await getCurrentUser();
        if (response.data?.data) {
          setUserData(response.data.data);

          if (isNewUser === 'true') {
            setShowTermsModal(true);
          } else {
            updateUser(response.data.data);
            navigate('/');
          }
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        navigate('/');
      }
    };

    handleOAuth2Redirect();
  }, [navigate, updateUser]);

  const handleTermsConfirm = () => {
    if (userData) {
      updateUser(userData);
    }
    setShowTermsModal(false);
    navigate('/');
  };

  const handleTermsCancel = () => {
    setShowTermsModal(false);
    navigate('/');
  };

  return (
    <>
      <OAuth2TermsModal
        isOpen={showTermsModal}
        onConfirm={handleTermsConfirm}
        onCancel={handleTermsCancel}
      />
      <div className={styles.container}>
        <div className={styles.spinner}></div>
        <p>로그인 처리 중...</p>
      </div>
    </>
  );
};

export default OAuth2RedirectPage;
