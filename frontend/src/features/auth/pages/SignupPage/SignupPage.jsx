import { Link } from 'react-router-dom';
import SignupForm from '../../components/SignupForm/SignupForm';
import styles from './SignupPage.module.css';

const SignupPage = () => {
  return (
    <div className={styles['page-container']}>
      <div className={styles['form-wrapper']}>
        <SignupForm />
        <p className={styles['switch-text']}>
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
