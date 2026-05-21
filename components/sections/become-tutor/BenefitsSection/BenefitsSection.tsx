import styles from "./BenefitsSection.module.scss";
import Section from "@/components/ui/Section/Section";
import Heading from "@/components/ui/Heading/Heading";
import Card from "@/components/ui/Card/Card";

const benefits = [
  {
    title: "גמישות מלאה",
    desc: "קבע שעות משלך ולמד מכל מקום",
  },
  {
    title: "קהל תלמידים גדול",
    desc: "גש למאגר תלמידים מכל הארץ",
  },
  {
    title: "כלים מתקדמים",
    desc: "ניהול יומן, תשלומים וסטטיסטיקות",
  },
];

export default function BenefitsSection() {
  return (
    <Section className={styles.benefitsSection}>
      <div className={styles.inner}>
        <Heading level="h2" underline className={styles.heading}>
          למה להצטרף לאלף1
        </Heading>
        <div className={styles.grid}>
          {benefits.map((b) => (
            <Card key={b.title} title={b.title} text={b.desc} height="20rem" hover />
          ))}
        </div>
      </div>
    </Section>
  );
}
