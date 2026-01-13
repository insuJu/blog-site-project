import styles from './StatCard.module.css';

const StatCard = ({ title, value, subValue, subLabel }) => {
  return (
    <div className={styles["stat-card"]}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.value}>{value}</div>
      {subValue !== undefined && (
        <div className={styles["sub-info"]}>
          <span className={styles["sub-value"]}>{subValue}</span>
          <span className={styles["sub-label"]}>{subLabel}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
