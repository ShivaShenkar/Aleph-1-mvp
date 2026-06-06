import { useNavigate } from "react-router-dom";
import styles from "./EmptyLessons.module.scss";

export default function EmptyLessons() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>אין לך שיעורים</h2>
      <button className={styles.button} onClick={() => navigate("/student/search")}>
        לחיפוש מורה
      </button>
    </div>
  );
}
