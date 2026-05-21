import styles from "./CtaSection.module.scss";
import Heading from "@/components/ui/Heading/Heading";
import Button from "@/components/ui/Button/Button";
import Section from "@/components/ui/Section/Section";

export default function CtaSection() {
  return (
    <Section className={styles.cta}>
      <div className={styles.inner}>
        <Heading level="h1">מוכן להתחיל את המסע שלך?</Heading>
        <Button className={styles.button} variant="primary" size="lg" text="התחל ללמוד" />
      </div>
    </Section>
  );
}
