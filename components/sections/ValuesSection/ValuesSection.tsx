"use client";

import { useState } from "react";
import styles from "./ValuesSection.module.scss";
import Heading from "@/components/ui/Heading/Heading";
import Card from "@/components/ui/Card/Card";
import Section from "@/components/ui/Section/Section";

const values = [
  {
    title: "מצוינות אקדמית",
    description:
      "שמירה על סטנדרטים גבוהים בהוראה ומחויבות להצלחת כל תלמיד.",
  },
  {
    title: "נגישות והזדמנות שווה",
    description:
      "כל תלמיד ראוי לחינוך איכותי ללא קשר לרקע או למקום מגוריו.",
  },
  {
    title: "קהילה תומכת",
    description:
      "בניית קהילה מקצועית של מורים ותלמידים התומכת זה בזה לאורך כל הדרך.",
  },
  {
    title: "חדשנות בלמידה",
    description:
      "שימוש בטכנולוגיה מתקדמת ליצירת חוויית למידה מותאמת אישית ויעילה.",
  },
];

export default function ValuesSection() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1+values.length) % values.length);
  const next = () => setCurrent((c) => (c + 1) % values.length);

  return (
    <Section>
      <div className={styles.inner}>
        <Heading level="h1" underline>הערכים שלנו</Heading>
      <div className={styles.carousel}>
        <button className={styles.arrow} onClick={prev} aria-label="הבא">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
          
        <Card
          title={values[current].title}
          text={values[current].description}
          width="48rem"
          height="19.3125rem"
        />
        <button className={styles.arrow} onClick={next} aria-label="הקודם">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
      </div>
      <div className={styles.dots}>
        {values.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot}${i === current ? ` ${styles.dotActive}` : ""}`}
            onClick={() => setCurrent(i)}
            aria-label={`ערך ${i + 1}`}
          />
        ))}
      </div>
      </div>
    </Section>
  );
}
