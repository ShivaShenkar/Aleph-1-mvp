import styles from "./HowItWorksSection.module.scss";
import Heading from "@/components/ui/Heading/Heading";
const steps = [
  {
    number: "1",
    title: "בחר נושא לימוד",
    description:
      "א1 מציעה מבחר מקיף של נושאי לימוד בכדי למצוא פתרון לכל תלמיד",
  },
  {
    number: "2",
    title: "מצא מורה מתאים לך",
    description:
      "לפלטפורמה שלנו רשומים מבחר רב של מורים מכל רחבי הארץ. כך תוכלו למצוא את המורה שעונה בדיוק לצרכים שלכם",
  },
  {
    number: "3",
    title: "קבע פגישה והתחל ללמוד!",
    description:
      "ניתן לקבוע שיעורים למורים במערכת יומן אינטרקטיבית, בלי בעיות וללא מאמץ",
  },
];

export default function HowItWorksSection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <Heading level="h2" underline>איך זה עובד</Heading>
        <div className={styles.steps}>
          {steps.map((step) => (
            <div key={step.number} className={styles.step}>
              <span className={styles.stepNumber} style={{ fontFamily: 'Comico' }}>{step.number}</span>
              <Heading level="h4">{step.title}</Heading>
              <p className={styles.stepDescription}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
