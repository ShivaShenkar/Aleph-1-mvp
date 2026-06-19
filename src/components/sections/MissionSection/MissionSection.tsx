import styles from "./MissionSection.module.scss";
import Heading from "@/components/ui/Heading/Heading";
//import DefaultAvatar from "@/components/ui/DefaultAvatar/DefaultAvatar";
import Section from "@/components/ui/Section/Section";

export default function MissionSection() {
  return (
    <Section>
      <div className={styles.inner}>
        <div className={styles.tab}>המשימה שלנו</div>
      <div className={styles.headingWrapper}>
        <Heading level="h1">עוזרים לתלמידים מכל שכבות האוכלוסייה להנות מלמידה</Heading>
      </div>
      <div className={styles.content}>
        <div className={styles.textCol}>
          <p className={styles.paragraph}>
            אנחנו מאמינים שכל תלמיד ראוי לגישה לחינוך ותמיכה איכותיים.
            א1 מחברת בין מורים מסורים לתלמידים נלהבים בסביבה גמישה ומהימנה.
            הפלטפורמה שלנו מסירה מחסומים ויוצרת הזדמנויות לחוויות למידה
            משמעותיות שמשנות חיים.
          </p>
          <p className={styles.paragraph}>
            אנו שואפים ליצור עולם שבו כל אדם יכול למצוא את המורה המושלם שלו
            ולהשיג את מלוא הפוטנציאל האקדמי והאישי שלו.
            המחויבות שלנו היא לספק כלים, משאבים ותמיכה לקהילה המתפתחת
            של הלומדים והמלמדים שלנו.
          </p>
        </div>
        {/* <div className={styles.illustrationCol}>
          <DefaultAvatar size="11.5625rem" label="Graphic Design" />
        </div> */}
      </div>
      </div>
    </Section>
  );
}
