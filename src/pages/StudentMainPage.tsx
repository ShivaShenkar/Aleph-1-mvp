import { useEffect } from "react";
import styles from "@/styles/student.module.scss";
import StudentNavBar from "@/components/sections/StudentNavBar/StudentNavBar";
import ClosestLessonHeading from"@/components/sections/student-home/ClosestLessonHeading/ClosestLessonHeading";
import GreetingHeading from "@/components/sections/student-home/GreetingHeading/GreetingHeading";
import LessonSchedule from "@/components/sections/student-home/LessonSchedule/LessonSchedule";
import { homePageLoad } from "@/lib/slotActions";

export default function StudentPage() {
  useEffect(() => {
    homePageLoad();
  }, []);

  return (
    <main className={styles.page}>
      <StudentNavBar />
      <div className={styles.headings}>
        <GreetingHeading />
        <ClosestLessonHeading />
      </div>
      <div className={styles.lessonSchedule}>
        <LessonSchedule />
      </div>
    </main>
  );
}
