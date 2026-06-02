import styles from "./student.module.scss";

export default function StudentPage() {
  return (
    <main className={styles.page}>
      <h1>לוח בקרה לתלמידים</h1>
      <p>כאן תוכל לחפש מורים, לקבוע שיעורים ולנהל את הלמידה שלך.</p>
    </main>
  );
}
