import styles from "./TutorHowItWorksSection.module.scss";
import Section from "@/components/ui/Section/Section";
import Heading from "@/components/ui/Heading/Heading";

const steps = [
  { number: "1", title: "הגש מועמדות", desc: "טופס פשוט בן 5 דקות" },
  { number: "2", title: "קבל אישור", desc: "בדיקה מהירה תוך 24-48 שעות" },
  { number: "3", title: "התחל ללמד", desc: "קבע לוח זמנים והתחל להרוויח" },
];

export default function TutorHowItWorksSection() {
  return (
    <Section className={styles.howItWorksSection}>
      <div className={styles.inner}>
        <Heading level="h2" underline>איך זה עובד</Heading>
        <div className={styles.steps}>
          {steps.map((step) => (
            <div key={step.number} className={styles.step}>
              <span className={styles.stepNumber} style={{ fontFamily: 'Comico' }}>{step.number}</span>
              <Heading level="h4">{step.title}</Heading>
              <p className={styles.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
