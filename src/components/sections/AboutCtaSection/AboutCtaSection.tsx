import styles from "./AboutCtaSection.module.scss";
import Heading from "@/components/ui/Heading/Heading";
//import Button from "@/components/ui/Button/Button";
import Section from "@/components/ui/Section/Section";

export default function AboutCtaSection() {
  return (
    <Section>
      <div className={styles.inner}>
        <Heading level="h2">מוכנים להתחיל את מסע הלמידה שלכם?</Heading>
        <p className={styles.text}>
          הצטרפו לתלמידים ומורים שכבר חלק מקהילת א1. בין אם אתם מחפשים ללמוד
          או ללמד, אנחנו כאן כדי לתמוך בכם בכל שלב.
        </p>
        {/* <Button variant="primary" size="lg" text="התחילו עכשיו" /> */}
      </div>
    </Section>
  );
}
