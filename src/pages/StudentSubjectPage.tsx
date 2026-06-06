import { useParams, Navigate } from "react-router-dom";
import StudentNavBar from "@/components/sections/StudentNavBar/StudentNavBar";
import Heading from "@/components/ui/Heading/Heading";
import { subjects } from "@/lib/subjects";
import styles from "@/styles/student.module.scss";

export default function StudentSubjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const subject = subjects.find((s) => s.slug === slug);

  if (!subject) {
    return <Navigate to="/student/search" replace />;
  }

  return (
    <>
      <StudentNavBar />
      <main className={styles.page}>
        <div className={styles.headings}>
          <Heading level="h1" underline>
            {subject.name}
          </Heading>
          <p className={styles.subtitle}>בקרוב — מורים בתחום זה יופיעו כאן</p>
        </div>
      </main>
    </>
  );
}
