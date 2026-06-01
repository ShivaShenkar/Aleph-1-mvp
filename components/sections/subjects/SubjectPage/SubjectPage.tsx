import styles from "./SubjectPage.module.scss";
import Heading from "@/components/ui/Heading/Heading";
import Section from "@/components/ui/Section/Section";
import TeacherCard from "../TeacherCard/TeacherCard";
import WhyUsSection from "../WhyUsSection/WhyUsSection";
import CtaSection from "../CtaSection/CtaSection";

const tutors = [
  {
    id: "1",
    name: "ד״ר יעקב כהן",
    bio: "מומחה להוראת מתמטיקה עם 15 שנות ניסיון. בעל תואר דוקטור מאוניברסיטת תל אביב.",
  },
  {
    id: "2",
    name: "מיכל לוי",
    bio: "מורה מוסמכת ומנוסה, מלמדת מתמטיקה בתיכונים ובחטיבות ביניים. גישה סבלנית וידידותית.",
  },
  {
    id: "3",
    name: "אבי מזרחי",
    bio: "מהנדס תוכנה לשעבר, מלמד מתמטיקה ברמה גבוהה. מתמחה בהכנה לבגרות ולפסיכומטרי.",
  },
  {
    id: "4",
    name: "שרה אברהם",
    bio: "מחנכת ותיקה עם ניסיון רב בהוראה מותאמת אישית. מאמינה שכל תלמיד יכול להצליח.",
  },
  {
    id: "5",
    name: "יוסי פרץ",
    bio: "מורה פרטי במתמטיקה מזה 8 שנים. מומחה בהוראת תלמידים עם קשיי למידה.",
  },
  {
    id: "6",
    name: "רחלי גולן",
    bio: "בוגרת אוניברסיטת חיפה בהצטיינות. מלמדת מתמטיקה לכל הגילאים בגישה יצירתית ומעשירה.",
  },
];

export default function SubjectPage({ subjectName }: { subjectName: string }) {
  return (
    <>
      <Section className={styles.intro}>
        <Heading level="h1">{`הכירו את המורים שלנו ל${subjectName}`}</Heading>
        <div className={styles.grid}>
          {tutors.map((t) => (
            <TeacherCard key={t.id} name={t.name} bio={t.bio} />
          ))}
        </div>
      </Section>
      <WhyUsSection />
      <CtaSection />
    </>
  );
}
