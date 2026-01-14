import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.links}>
            <Link to="/terms" className={styles.link}>이용약관</Link>
            <span className={styles.separator}>·</span>
            <Link to="/privacy" className={styles.link}>개인정보처리방침</Link>
          </div>
          <p className={styles.copyright}>
            © {currentYear} Writon. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
