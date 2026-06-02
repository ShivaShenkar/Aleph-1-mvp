import styles from "./StatsBar.module.scss";

const stats = [
  { number: "5,000+", label: "מורים רשומים" },
  { number: "50,000+", label: "תלמידים" },
  { number: "85%", label: "עמלה למורה" },
];

export default function StatsBar() {
  return (
    <div className={styles.bar}>
      {stats.map((s, i) => (
        <div key={i} className={styles.stat}>
          <span className={styles.number}>{s.number}</span>
          <span className={styles.label}>{s.label}</span>
        </div>
      ))}
    </div>
  );
}
