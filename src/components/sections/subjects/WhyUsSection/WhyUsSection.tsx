import styles from "./WhyUsSection.module.scss";
import Heading from "@/components/ui/Heading/Heading";
import Section from "@/components/ui/Section/Section";

const benefits = [
  "מורים מקצועיים ומוסמכים עם שנות ניסיון בהוראה",
  "למידה מותאמת אישית המותאמת לקצב ולסגנון הלמידה שלך",
  "שיעורים גמישים שמתאימים לוח הזמנים העמוס שלך",
  "מחירים תחרותיים ומגוון חבילות לבחירה",
  "מעקב אחר התקדמות ודוחות מפורטים להורים",
];

export default function WhyUsSection() {
  return (
    <Section>
      <div className={styles.inner}>
        
        <div className={styles.textCol}>
          <Heading level="h2">למה ללמוד איתנו</Heading>
          <ul className={styles.bullets}>
            {benefits.map((b, i) => (
              <li key={i} className={styles.bullet}>
                <span className={styles.checkmark}>✓</span>
                {b}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.illustrationCol}>
          <div className={styles.iconPlaceholder}>
            {/* <svg viewBox="0 0 96 96" fill="#E5E7EB">
              <circle cx="48" cy="48" r="48" />
            </svg> */}
            {/*<span className={styles.iconLabel}>איור / גרפיקה</span>*/}
          </div>
        </div>
      </div>
    </Section>
  );
}
