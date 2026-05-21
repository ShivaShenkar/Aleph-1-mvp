import styles from "./SubjectsSection.module.scss";
import Heading from "@/components/ui/Heading/Heading";
import Card from "@/components/ui/Card/Card";

const subjects = [
  { name: "מתמטיקה" },
  { name: "אנגלית" },
  { name: "היסטוריה" },
  { name: "עברית" },
  { name: "אזרחות" },
  { name: "תנ\"ך" },
];

const subjectRows = [subjects.slice(0, 3), subjects.slice(3, 6)];

export default function SubjectsSection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <Heading level="h2" underline>בחר נושא לימוד</Heading>
        <div className={styles.gallery}>
          {subjectRows.map((row, i) => (
            <div key={i} className={styles.row}>
              {row.map((s) => (
                <Card key={s.name} title={s.name} href="https://google.com" hover/>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
