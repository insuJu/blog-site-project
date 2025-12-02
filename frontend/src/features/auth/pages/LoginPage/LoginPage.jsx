import { Link } from 'react-router-dom';
import LoginForm from '../../components/LoginForm/LoginForm';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  return (
    <div className={styles['page-container']}>
      <div className={styles['form-wrapper']}>
        <LoginForm />
        <p className={styles['switch-text']}>
          계정이 없으신가요? <Link to="/signup">회원가입</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
