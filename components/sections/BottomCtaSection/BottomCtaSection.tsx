import styles from "./BottomCtaSection.module.scss";
import Button from "@/components/ui/Button/Button";

export default function BottomCtaSection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>נו, למה אתם מחכים?</h2>
        <p className={styles.text}>
          הצטרפו לקהילת התלמידים שלנו ותוכלו למצוא השיעור הפרטי שאתם רוצים!
        </p>
        <Button variant="primary" size="lg" text="התחילו עכשיו" />
      </div>
    </section>
  );
}
