"use client";
import styles from "./HeroSection.module.scss";
import Section from "@/components/ui/Section/Section";
import Heading from "@/components/ui/Heading/Heading";
import Button from "@/components/ui/Button/Button";
import RainingMoneyBackground from "@/components/sections/RainingMoney/RainingMoney";

export default function HeroSection() {
  return (
    <Section className={styles.heroOuter}>
      <RainingMoneyBackground />
      <div className={styles.inner}>
        <Heading level="h1">הפוך את המומחיות שלך <span className={styles.goldText}>להכנסה</span></Heading>
        <p className={styles.subtitle}>למד תלמידים והרוויח בתנאים שלך</p>
        <div className={styles.subtext}>
          <p>שתף את הידע שלך</p>
          <p>התחבר לתלמידים שזקוקים לידע שלך. קבע את השעות שלך.</p>
        </div>
        <div className={styles.buttons}>
          <Button variant="primary" size="lg" text="התחילו ללמד עכשיו" />
        </div>
      </div>
    </Section>
  );
}
