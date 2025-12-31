import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../contexts/AuthContext';
import { getCurrentUser } from '../../api/authApi';
import styles from './OAuth2RedirectPage.module.css';

const OAuth2RedirectPage = () => {
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  useEffect(() => {
    const handleOAuth2Redirect = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const error = urlParams.get('error');

      if (error) {
        console.error('OAuth2 authentication failed:', error);
        navigate('/');
        return;
      }

      try {
        const response = await getCurrentUser();
        if (response.data?.data) {
          updateUser(response.data.data);
        }
        navigate('/');
      } catch (error) {
        console.error('Failed to load user:', error);
        navigate('/');
      }
    };

    handleOAuth2Redirect();
  }, [navigate, updateUser]);

  return (
    <div className={styles.container}>
      <div className={styles.spinner}></div>
      <p>로그인 처리 중...</p>
    </div>
  );
};

export default OAuth2RedirectPage;
