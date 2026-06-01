"use client";
import { useState } from "react";
import styles from "./FaqSection.module.scss";
import Section from "@/components/ui/Section/Section";
import Heading from "@/components/ui/Heading/Heading";

const faqs = [
  { q: "מי יכול להפוך למורה באלף1?", a: "כל מי שיש לו ידע וניסיון בנושא מסוים יכול להגיש מועמדות. אנחנו בודקים כל בקשה כדי להבטיח איכות גבוהה." },
  { q: "כמה זמן לוקח תהליך האישור?", a: "רוב הבקשות מאושרות תוך 24-48 שעות." },
  { q: "איך אני מקבל תשלום?", a: "התשלומים מועברים ישירות לחשבון הבנק שלך מדי שבוע." },
  { q: "האם אני קובע את המחירים שלי?", a: "כן, אתה קובע את המחירים שלך ואנחנו לוקחים עמלה של 15% בלבד." },
  { q: "האם אפשר ללמד באונליין ובפרונטלי?", a: "כן, אתה בוחר את אופן ההוראה שמתאים לך." },
  { q: "מה קורה אם תלמיד מבטל שיעור?", a: "יש לנו מדיניות ביטולים גמישה המגנה על שני הצדדים." },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <Section className={styles.faqSection}>
      <div className={styles.inner}>
        <Heading level="h2">שאלות נפוצות</Heading>
        <div className={styles.list}>
          {faqs.map((item, i) => (
            <div key={i} className={styles.item}>
              <button
                className={styles.question}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                {item.q}
                <span className={styles.icon}>{openIndex === i ? "−" : "+"}</span>
              </button>
              {openIndex === i && (
                <p className={styles.answer}>{item.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
