import styles from "./HeroSection.module.scss";
//import Button from "@/components/ui/Button/Button";
import Heading from "@/components/ui/Heading/Heading";

export default function HeroSection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        
        <div className={styles.textCol}>
          <div className={styles.heading1Wrapper}>
            <Heading level="h1">א1- למצוא מורה פרטי לא צריך להיות קשה</Heading>
          </div>
          <div className={styles.heading2Wrapper}>
            <Heading level="h2">התחבר למאגר עצום של מורים מומחים וקבל הצלחה בלימודים!</Heading>
          </div>
          <p className={styles.description}>
            א1 היא פלטפורמה המחברת בין תלמידים ומורים בצורה יעילה.
            כאן תוכלו למצוא את המורה שעונה בדיוק לצורך שלכם
            בלי לשבור את הראש!
          </p>
          {/* <Button variant="primary" size="lg" text="התחילו ללמוד עכשיו" /> */}
        </div>
        <div className={styles.illustrationCol}>
          <div className={styles.illustrationWrapper}>
            <img src="/svg/Aleph1-big-CTA-logo.svg" alt="איור ראשי" className={styles.illustrationImg} />
          </div>
        </div>
      </div>
    </section>
  );
}
