import styles from "./CtaSection.module.scss";
import Section from "@/components/ui/Section/Section";
import Heading from "@/components/ui/Heading/Heading";
import Button from "@/components/ui/Button/Button";

export default function CtaSection() {
  return (
    <Section className={styles.ctaOuter}>
      <div className={styles.inner}>
        <Heading level="h2">התחל להרוויח מההוראה שלך</Heading>
        <p className={styles.text}>התחל להרוויח על ידי הוראת מה שאתה יודע</p>
        <Button variant="secondary" size="lg" text="הגש בקשה כמורה" />
        <p className={styles.trust}>
          הצטרף ליותר מ-5,000 מורים שכבר מלמדים בפלטפורמה שלנו
        </p>
      </div>
    </Section>
  );
}
