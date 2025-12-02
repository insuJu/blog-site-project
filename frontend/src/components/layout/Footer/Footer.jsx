import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <p className={styles.copyright}>
            © {currentYear} 쭈로그. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
